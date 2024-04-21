import Link from "next/link";
import styles from "./post-snippet.module.css";

export default function Renderer({ items }) {
  let image;
  const components = items.map((item) => {
    const src = /\<img .* src=[\\]*"([^"\\]*)[\\]*"/m.exec(item.html);
    if (src && src[1]) {
      image = (
        <div className={styles.container}>
          <div className={styles.image}>
            <img src={src[1]} className={styles.img} />
          </div>
          <div className={styles.text}>{item.snippetHTML}</div>
        </div>
      );
    }
    if (!image) {
      image = item.snippetHTML;
    }
    return (
      <div className="surface-card p-4 shadow-2 border-round" key={item.link}>
        <div className="text-3xl font-medium text-900 mb-2">
          <Link className="no-underline" href={item.link}>
            {item.title}
          </Link>
        </div>
        <div className="font-medium text-500 mb-3">{item.pubDate}</div>
        <div className="p-2">
          {image}
          <Link className="no-underline" href={item.link}>
            MORE...
          </Link>
        </div>
        <hr />
      </div>
    );
  });

  return components;
}
