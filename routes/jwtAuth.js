const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../util/jwtGenerator')
const validInfo = require('../middleware/validInfo')
const authorization = require('../middleware/authorization');

router.post('/register', validInfo, async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        const user = await pool.query('select * from user_account where email = $1', [email]);
        if(user.rows.length !== 0){
            res.status(400).send("There's already an account registered with that email");
        }
        else {
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const newUser = await pool.query('insert into user_account (first_name, last_name, email, password) values ($1, $2, $3, $4) returning *', [first_name, last_name, email, bcryptPassword]);

            const token = await jwtGenerator(newUser.rows[0].id);
            res.json({token})
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error - hold on tight');
    }
});

router.post('/login', validInfo, async (req, res) => {
    try {
        const {email, password} = req.body;
        //console.log(email + password)
        const user = await pool.query('select * from user_account where email = $1', [email]);
        if(user.rows.length === 0){
            res.status(400).send("We don't have a user registered with that email");
        }
        else{
            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if(!validPassword){
                return res.status(401).send('Password is incorrect');
            }
            const token = jwtGenerator(user.rows[0].id);
            res.json({token});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error - hold on tight')
    }
})

router.get('/verify', authorization, async (req, res, next) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('oops server error');
    }
})

router.get('/getId', authorization, async (req, res, next) => {
    try {
        const id = req.user;
        res.json(id);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;