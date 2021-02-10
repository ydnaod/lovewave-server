const express = require('express');
const router = express.Router();
const pool = require('../db');
const fetch = require('node-fetch');
const authorization = require('../middleware/authorization');


router.use(authorization);

router.post('/', async (req, res) => {
    try {
        const {user_account_id, other_user_account_id, swiped} = req.body;
        //console.log(req.body);
        const query = await pool.query('insert into swipes (user_account_id, other_user_account_id, swiped) values ($1, $2, $3)', [user_account_id, other_user_account_id, swiped]);
        //console.log(query.rows)
        //check to see if there is a match
        const theirSwipe = await pool.query('select swiped from swipes where user_account_id = $1 and other_user_account_id = $2', [other_user_account_id, user_account_id]);
        //console.log(theirSwipe.rows);
        if(theirSwipe.rows.length === 0){
            query.match = null;
        }
        else if(theirSwipe.rows[0].swiped === swiped){
            query.match = true;
            const createConvo = await pool.query('insert into conversation (user_account_id, other_user_account_id) values ($1, $2)', [other_user_account_id, user_account_id]);
            console.log(createConvo);
        }
        else{
            query.match = false;
        }
        res.json(query)
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;