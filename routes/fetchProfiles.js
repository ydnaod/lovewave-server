const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');


router.use(authorization);

router.get('/random', async (req, res) => {
    try {
        //console.log(req.user)
        const query = await pool.query('select id from user_account where id not in (select other_user_account_id from swipes where user_account_id=$1) and id != $1 limit 10', [req.user]);
        res.json(query.rows);
    } catch (error) {
        console.error(error.message);
        console.log('does this change save')
    }
})

module.exports = router;