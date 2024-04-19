/**
 * FolderEntry represents a file's meta data in the folder-file
 * it is managed by Folder.
 */
export class FolderEntry {
  constructor(attributes) {
    Object.assign(
      this,
      { createdAt: Date.now(), updatedAt: Date.now() },
      attributes,
    );
  }

  toJSON() {
    return {
      filename: this.filename,
      filetype: this.filetype,
      size: this.size,
      createdAt: this.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
  }
}

/**
 * each filesystem has one folder containing the folder entries
 * with pointers to files "contained" in the folder.
 */
export class Folder {
  constructor(folderStore, folderEntries = new Map()) {
    this.folderEntries = folderEntries;
    this.folderStore = folderStore;
  }

  get filesystem() {
    return this.folderStore.filesystem;
  }

  get size() {
    return this.folderEntries.size;
  }

  readFile(filename) {
    return this.folderStore.readFile(filename);
  }

  writeFile(filename, data, filetype) {
    /* the order matters -- structures stay consistent */
    const bytesWritten = this.folderStore.writeFile(filename, data, filetype);
    if (!bytesWritten) {
      return false;
    }
    let folderEntry = this.folderEntries.get(filename);
    if (folderEntry == null) {
      folderEntry = new FolderEntry({ filename, createdAt: Date.now() });
    }
    folderEntry.size = bytesWritten;
    folderEntry.updatedAt = Date.now();
    folderEntry.filetype = filetype;
    this.folderEntries.set(filename, folderEntry);
    this.folderStore.writeFolder(this);
    return true;
  }

  removeFile(filename) {
    /* the order matters -- structures stay consistent */
    this.folderEntries.delete(filename);
    this.folderStore.writeFolder(this);
    this.folderStore.removeFile(filename);
  }

  toJSON() {
    return {
      folderEntries: [...this.folderEntries].map(([filename, entry]) => [
        filename,
        entry.toJSON(),
      ]),
    };
  }

  static fromFactory(filesystem, json) {
    const folderEntries = new Map(
      json.folderEntries.map((entry) => [entry[0], new FolderEntry(entry[1])]),
    );
    const folderStore = new FolderStore(filesystem);
    return new Folder(folderStore, folderEntries);
  }

  static factory(filesystem) {
    const folderStore = new FolderStore(filesystem);
    const folder = folderStore.readFolder();
    return folder;
  }
}

/**
 * STORES
 */
/**
 * FileStore reads and writes files
 */
export class FileStore {
  constructor(folder) {
    this.folder = folder;
  }

  get device() {
    return this.folder.filesystem.device;
  }

  get filesystemName() {
    return this.folder.filesystem.filesystemName;
  }

  getFilename(filename) {
    return `diffeo-${this.filesystemName}-file:${filename}`;
  }

  readFile(filename) {
    const pathname = this.getFilename(filename);
    return this.device.read(pathname);
  }

  writeFile(filename, data) {
    const pathname = this.getFilename(filename);
    return this.device.write(pathname, data);
  }

  removeFile(filename) {
    const pathname = this.getFilename(filename);
    return this.device.remove(pathname);
  }
}

/**
 * FoldStore reads and writes files (passing the request to FileStore)
 * and folders (handled locally).
 */
export class FolderStore {
  constructor(filesystem) {
    this.filesystem = filesystem;
    this.fileStore = new FileStore(this);
  }

  get folderName() {
    return `diffeo-${this.filesystem.filesystemName}-folder`;
  }

  get device() {
    return this.filesystem.device;
  }

  readFile(filename) {
    return this.fileStore.readFile(filename);
  }

  writeFile(filename, data) {
    return this.fileStore.writeFile(filename, data);
  }

  removeFile(filename) {
    return this.fileStore.removeFile(filename);
  }

  readFolder() {
    let folder;
    const blob = this.device.read(this.folderName);
    if (blob != null) {
      folder = Folder.fromFactory(this.filesystem, blob);
    }
    if (folder == null) {
      folder = new Folder(this);
      this.writeFolder(folder);
    }
    return folder;
  }

  writeFolder(folder) {
    const blob = folder.toJSON();
    return this.device.write(this.folderName, blob);
  }
}

export class Coder {
  encode = (thing) => thing;
  decode = (thing) => thing;
}

export class JSONCoder extends Coder {
  encode = (thing) => JSON.stringify(thing);
  decode = (thing) => JSON.parse(thing);
}

/**
 * DEVICE LAYER
 * A DEVICE is a store's raw reader/writer
 */
export class Device {
  *keys() {
    yield;
  }
  read(_key) {
    return null;
  }
  write(_key, _value) {
    return null;
  }
  remove(_key) {
    return null;
  }
}

/**
 * LocalStorageDevice implements Device for
 * localStorage.
 */
export class LocalStorageDevice extends Device {
  constructor(coder = new JSONCoder()) {
    super();
    this.coder = coder;
    if ([...this.keys()].some((key) => key.match(/^diffeo[.]cache[$]/))) {
      // if there are any only caches -- remove them
      this.clear();
    }
  }
  *keys() {
    for (let i = 0; i < localStorage.length; i++) {
      yield window.localStorage.key(i);
    }
  }
  read(key) {
    try {
      return this.coder.decode(window.localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  }
  write(key, value) {
    try {
      window.localStorage.setItem(key, this.coder.encode(value));
      return value.length;
    } catch (e) {
      return null;
    }
  }
  remove(key) {
    return window.localStorage.removeItem(key);
  }
  clear() {
    return window.localStorage.clear();
  }
}

/**
 * API
 *
 * The Filesystem is the API for reading/writing files.
 * Tracking their names, sizes, create/update times
 */
export class Filesystem {
  constructor(filesystemName, device = null) {
    if (device == null) {
      this.device = new Device();

      // Chrome forbids references to `window.localStorage` from inline code injected via the
      // special `data:` URI scheme.
      try {
        if (typeof localStorage === "undefined") {
          this.device = new Device();
        } else {
          this.device = new LocalStorageDevice();
        }
      } catch (x) {
        // Exception likely triggered as a result of unauthorized access to `localStorage`.
        this.device = new Device();
      }
    } else {
      this.device = device; /* this must be set before Folder.factory call */
    }
    this.filesystemName = filesystemName;
    this.folder = Folder.factory(this);
    this.maxSize = 5 * 1000 * 1000;
    this.highWater = 0.75;
    this.lowWater = 0.5;
  }

  get totalSize() {
    return this.listFolderEntries().reduce(
      (total, entry) => total + entry.size,
      0,
    );
  }

  readFile(filename) {
    return this.folder.readFile(filename);
  }
  writeFile(filename, data, filetype) {
    this.fsck();
    return this.folder.writeFile(filename, data, filetype);
  }
  removeFile(filename) {
    return this.folder.removeFile(filename);
  }

  listFiles() {
    return [...this.folder.folderEntries.keys()];
  }
  listFolderEntries() {
    return [...this.folder.folderEntries.values()];
  }
  fileExists(name) {
    return this.folder.folderEntries.has(name);
  }
  folderEntry(name) {
    return this.folder.folderEntries.get(name);
  }

  fsck() {
    if (this.totalSize > this.maxSize * this.highWater) {
      while (this.totalSize > this.maxSize * this.lowWater) {
        const oldest = this.listFolderEntries().sort(
          (a, b) => (a.updatedAt || a.createdAt) - (b.updateAt || b.createdAt),
        )[0];
        this.removeFile(oldest.filename);
      }
    }
  }
}
