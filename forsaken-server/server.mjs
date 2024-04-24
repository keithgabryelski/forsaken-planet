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
const port = 3100;
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
  res.send('Welcome to forsaken-planet.com!');
});

app.get('/reports', (req, res) => {
  res.send(allReports);
});
