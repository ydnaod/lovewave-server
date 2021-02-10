const Pool = require('pg').Pool;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'andydo',
    //password: '',
    database: 'lovewav'
});

module.exports = pool;