require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// Ejecuta el archivo SQL indicado: `node src/db/init.js` (schema.sql) o `node src/db/init.js seed.sql`
const archivo = process.argv[2] || 'schema.sql';
const sql = fs.readFileSync(path.join(__dirname, archivo), 'utf8');

pool.query(sql)
    .then(() => console.log(`${archivo} aplicado ✅`))
    .catch((err) => {
        console.error(`Error al aplicar ${archivo} ❌`, err.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
