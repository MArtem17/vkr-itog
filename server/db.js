const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: 'Artem3647',
    host: 'localhost',
    port: 5432,
    database: "vkr"
})

module.exports = pool