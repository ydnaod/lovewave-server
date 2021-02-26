const express = require('express');
const router = express.Router();
const pool = require('../db');
const fetch = require('node-fetch');
const authorization = require('../middleware/authorization');


router.use(authorization);

router.post('/', async (req, res) => {
    try {
        const {user_account_id, other_user_account_id, swiped, guess} = req.body;
        //console.log(req.body);
        const query = await pool.query('insert into swipes (user_account_id, other_user_account_id, swiped, favorite_lyric_guess) values ($1, $2, $3, $4)', [user_account_id, other_user_account_id, swiped, guess]);
        //console.log(query.rows)
        //check to see if guess was correct
        query.guess = null;
        let favoriteLyric;
        let guessMessage;
        if(guess){
            favoriteLyric = await pool.query('select * from lyrics_slide where user_account_id = $1', [other_user_account_id]);
            console.log(favoriteLyric);
            if(guess === favoriteLyric.rows[4]){
                query.guess = true;
                guessMessage = 'This person guessed your favorite lyric correctly!'
            }
            else{
                query.guess = false;
                guessMessage = 'This person guessed your favorite lyric incorrectly'
            }
        }
        //check to see if there is a match
        const theirSwipe = await pool.query('select swiped from swipes where user_account_id = $1 and other_user_account_id = $2', [other_user_account_id, user_account_id]);
        //console.log(theirSwipe.rows);
        if(theirSwipe.rows.length === 0){
            query.match = null;
        }
        else if(theirSwipe.rows[0].swiped === swiped){
            query.match = true;
            const createConvo = await pool.query('insert into conversation (user_account_id, other_user_account_id) values ($1, $2) returning *', [other_user_account_id, user_account_id]);
            console.log(createConvo);
            if(query.guess === true){
                const query = pool.query('insert into message (user_account_id, conversation_id, message) values ($1, $2, $3)', [999, createConvo.rows[0], guessMessage]);
            }
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