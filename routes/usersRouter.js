const express = require('express');
const router = express.Router();
const pool = require('../db')

router.post('/', async (req, res) => {
    try {
        const {email, password, first_name, last_name, access_token, refresh_token} = req.body;
        const newUser = await  pool.query('insert into user_account (email, password, first_name, last_name) values ($1, $2, $3, $4) returning *', [email, password, first_name, last_name])
        res.json(newUser);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;