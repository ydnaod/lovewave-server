const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');


router.use(authorization);

router.param('id', async (req, res, next) => {
    try {
        const query = await pool.query('select playlist_id, photo,theme_song_id, first_name from user_profile where user_account_id = $1', [req.params.id])
        if (query.rows.length == 0) {
            res.status(404).send('user not found');
        }
        req.id = req.params.id;
        next();
    } catch (error) {
        console.error(error.message);
    }
})

router.get('/:id', async (req, res) => {
    const query = await pool.query('select playlist_id, photo,theme_song_id, first_name from user_profile where user_account_id = $1', [req.id])
    for(const setting in query.rows[0]){
        console.log(query.rows[0][setting]);
        if(query.rows[0][setting] == null){
            res.status(400).send('sorry')
        }
    }
    res.json(query.rows[0]);
})

//update playlist
router.put('/:id/playlist', async (req, res) => {
    try {
        const {playlistId} = req.body;
        //console.log(playlistId);
        const query = await pool.query(`update user_profile set playlist_id=$1 where user_account_id = $2 returning *`, [playlistId, req.id])
        console.log(query)
        res.json(query.rows);
    } catch (error) {
        console.error(error.message);
    }
})

//get current playlist
router.get('/:id/playlist', async (req, res) => {
    try {
        const query = await pool.query(`select playlist_id from user_profile where user_account_id = $1`, [req.id])
        console.log(query)
        res.json(query.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

//get theme song
router.get('/:id/theme-song/', async (req, res) => {
    try {
        const query = await pool.query(`select theme_song_id from user_profile where user_account_id = $1`, [req.id])
        //console.log(query)
        res.json(query.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

//update theme song
router.put('/:id/theme-song/:songId', async (req, res) => {
    try {
        const query = await pool.query(`update user_profile set theme_song_id=$1 where user_account_id = $2 returning *`, [req.params.songId, req.id])
        //console.log(query)
        res.json(query.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

//get name
router.get('/:id/name', async (req, res) => {
    try {
        console.log('this happens')
        const query = await pool.query('select first_name from user_profile where user_account_id = $1', [req.id]);
        //console.log(query)
        res.json(query.rows[0].first_name);
    } catch (error) {
        console.error(error.message)
    }
})


//get profile picture
router.get('/:id/photo', async (req, res) => {
    try {
        console.log('this happens')
        const query = await pool.query('select photo from user_profile where user_account_id = $1', [req.id]);
        //console.log(query)
        res.json(query.rows[0].photo);
    } catch (error) {
        console.error(error.message)
    }
})

//create profile
router.post('/create-profile', async (req, res) => {
    try {
        const {first_name} = req.body;
        //console.log(req.body);
        const query = await pool.query('insert into user_profile (user_account_id, first_name) values ($1, $2) returning *', [req.user, first_name]);
        res.json(query.rows);
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = router;