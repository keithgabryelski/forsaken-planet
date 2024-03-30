import fs from 'fs';
import http from 'http';
import https from 'https';
import express from "express";
import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import cors from "cors"

let allReports = [];
const indexes = {
    byGroup: new Map(),
    byCategory: new Map(),
    byName: new Map(),
    byPerk: new Map(),
    byCost: [],
    byIcon: new Map(),
    byDamage: [],
    byDamageType: new Map(),
}
let reportsByGroup = new Map();
const reportByCategory = new Map();
const reportByName = new Map();
const reportByPerk = new Map();

function logMapKeys(text, map) {
    console.info(text + ':', map.size);
    const keys = [...map.keys()];
    if (keys.length < 10) {
        console.info('  ', keys.join(', '))
        return;
    }
    for (let i = 0; i < keys.length; i += 5) {
        console.info('  ', keys.slice(i, i+5).join(', '))
    }
}
function buildAllReportsIndexes(data) {
    console.info('parsing', data.length, 'rows', new Date().toString());
    allReports = data.filter(
        datum => datum && datum.Name && datum.Group && datum.Category && datum.Icon
    ).map((datum, i) => Object.assign(datum, {rowID: i}));
    allReports.reduce((collections, item) => {
        collections.byGroup.set(item.Group, (collections.byGroup.get(item.Group) ?? []).concat(item));
        collections.byCategory.set(item.Category, (collections.byCategory.get(item.Category) ?? []).concat(item));
        collections.byName.set(item.Name, (collections.byGroup.get(item.Name) ?? []).concat(item));
        collections.byIcon.set(item.Icon, (collections.byIcon.get(item.Icon) ?? []).concat(item))
        const damageType = item.DamageType = item['Damage Type'] || 'physical';
        delete item['Damage Type'];
        collections.byDamageType.set(damageType, (collections.byDamageType.get(damageType) ?? []).concat(item))
        if (item.Cost) {
            collections.byCost[item.Cost] = (collections.byCost[item.Cost] ?? []).concat(item);
        }
        if (item.Damage) {
            collections.byDamage[item.Damage] = (collections.byDamage[item.Damage] ?? []).concat(item);
        }
        if (item.Perk1) {
            collections.byPerk.set(item.Perk1, (collections.byPerk.get(item.Perk1) ?? []).concat(item))
        }
        if (item.Perk2) {
            collections.byPerk.set(item.Perk2, (collections.byPerk.get(item.Perk2) ?? []).concat(item))
        }
        return collections;
    }, indexes);
    console.info('row 3:', data[3]);
    console.info("parsed", new Date().toString());
    logMapKeys("byGroup:", indexes.byGroup);
    logMapKeys("byCategory:", indexes.byCategory);
    logMapKeys("byName:", indexes.byName);
    logMapKeys("byIcon:", indexes.byIcon);
    logMapKeys("byPerk:", indexes.byPerk);
    logMapKeys("byDamageType:", indexes.byDamageType);
}

function fetchAndParseAllData() {
    const spreadsheetId = '15XGevBozTrsKYo2EGDgq5onnf2fHgTcJfXuA5vTeSnY'
    const parser = new PublicGoogleSheetsParser(spreadsheetId, {
        sheetName: "All Reports", useFormat: false
    })
    parser.parse().then(buildAllReportsIndexes)
}

const app = express();
app.use(cors());
const port = 3001;
let server = null;
try {
    const options = {
        key: fs.readFileSync('/etc/pki/tls/private/forsaken-planet.key'),
        cert: fs.readFileSync('/etc/pki/tls/certs/forsaken-planet.pem'),
    };
    server = https.createServer(options, app).listen(port, function() {
        console.log("Express server listening on port " + port);
    });
} catch (e) {
}
if (!server) {
    server = http.createServer({}, app).listen(port, function() {
        console.log("Express server listening on port " + port);
    });
}    

fetchAndParseAllData();

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.get('/reports', (req, res) => {
  res.send(allReports);
});

app.get('/drop-rate', (req, res) => {
    let {name,categoryName,groupName,damageMin,damageMax,damageType,perk1,perk2,live} = req.query
    live = live === "true";
    const results = {
        totalDrops: allReports.length,
        drops: allReports,
        name: {
            name,
            valid: [...indexes.byName.keys()],
        },
        group: {
            groupName,
            valid: [...indexes.byGroup.keys()],
        },
        category: {
            categoryName,
            valid: [...indexes.byCategory.keys()],
        },
        damage: {
            damageMin,
            damageMax,
        },
        damageType: {
            damageType,
            valid: [...indexes.byDamageType.keys()],
        },
        perk1: {
            perk1,
            valid: [...indexes.byPerk.keys()],
        },
        perk2: {
            perk2,
            valid: [...indexes.byPerk.keys()].filter(p => p !== perk1),
        }
    }
    if (name) {
        results.drops = indexes.byName.get(name);
        results.name.size = results.drops.length
    } else if (groupName) {
        results.drops = indexes.byGroup.get(groupName);
        results.group.size = results.drops?.length || 0;
    } else if (categoryName) {
        results.drops = indexes.byCategory.get(categoryName);
        results.category.size = results.drops.length;
    }
    if (damageType) {
        results.drops = results.drops.filter(item => item.DamageType === damageType);
        results.damageType.size = results.drops.length;
    }
    if (damageMin != null || damageMax != null) {
        let min = Number(damageMin) || 0;
        let max = Number(damageMax) || 100;
        if (min > max) {
            const save = min;
            min = max;
            max = save;
        }
        results.drops = results.drops.filter(item => {
            const damage = Number(item.Damage) || 0;
            return damage >= min && damage <= max;
        })
        results.damage.size = results.drops.length;
    }
    const dropsBeforePerks = results.drops;
    results.live = live;
    if (live) {
        if (perk1) {
            results.drops = results.drops.filter(item => item.Perk1 === perk1 || item.Perk2 === perk1);
            results.perk1.size = results.drops.length;
        }
        if (perk2) {
            results.drops = results.drops.filter(item => item.Perk1 === perk2 || item.Perk2 === perk2);
            results.perk2.size = results.drops.length;
        }
        results.numDrops = results.drops?.length||0;
    } else {
        if (perk1) {
            results.drops = dropsBeforePerks.filter(item => item.Perk1 === perk1 || item.Perk2 === perk1);
            results.perk1.size = results.drops.length;
        }
        if (perk2) {
            results.drops = dropsBeforePerks.filter(item => item.Perk1 === perk2 || item.Perk2 === perk2);
            results.perk2.size = results.drops.length;
        }
        results.numDrops = results.drops?.length||0;
        results.drops = null;
    }
    
    res.send(results);
});

