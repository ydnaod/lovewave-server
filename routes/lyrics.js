const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const fetch = require('node-fetch');

router.use(authorization);

router.param('id', async (req, res, next) => {
    try {
        const query = await pool.query('select * from lyrics_slide where user_account_id = $1', [req.params.id])
        if (query.rows.length == 0) {
            res.status(404).send('user not found');
        }
        req.id = req.params.id;
        next();
    } catch (error) {
        console.error(error.message);
    }
})

//musixmatch api
router.get('/track/:trackId', async (req, res) => {
    const response = await fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${req.params.trackId}&apikey=${process.env.musix_match_apikey}`, {
        method: 'GET'
    });
    const parseRes = await response.json();
    console.log(parseRes.message.body.lyrics);
    res.json(parseRes.message.body.lyrics);
})

router.get('/search/:term', async (req, res) => {
    const response = await fetch(`http://api.musixmatch.com/ws/1.1/track.search?q_track=${req.params.term}&f_has_lyrics&s_track_rating=desc&apikey=${process.env.musix_match_apikey}`, {
        method: 'GET'
    });
    const parseRes = await response.json();
    //console.log(parseRes.message.body.lyrics);
    res.json(parseRes.message.body.track_list);
})

router.get('/:id/favorite', async (req, res) => {
    try {
        const query = await pool.query('select * from lyrics_slide where user_account_id = $1', [req.id]);
        console.log(query.rows[0]);
        res.json(query.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
})

router.post('/save-favorite-lyric', async (req, res) => {
    const { song_artist, song_title, favorite_lyric, line_one, line_two, line_three, line_four, line_five } = req.body;
    //console.log(song_artist);
    const query = await pool.query('insert into lyrics_slide (user_account_id, song_artist, song_title, favorite_lyric, line_one, line_two, line_three, line_four, line_five) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *', [req.user, song_artist, song_title, favorite_lyric, line_one, line_two, line_three, line_four, line_five]);
    res.json(query.rows[0]);
});

router.put('/edit-favorite-lyric', async (req, res) => {
    const { song_artist, song_title, favorite_lyric, line_one, line_two, line_three, line_four, line_five } = req.body;
    //console.log(song_artist);
    const query = await pool.query('update lyrics_slide set song_artist = $1, song_title = $2, favorite_lyric = $3, line_one =$4, line_two =$5, line_three = $6, line_four = $7, line_five = $8 where user_account_id=$9 returning *', [song_artist, song_title, favorite_lyric, line_one, line_two, line_three, line_four, line_five, req.user]);
    res.json(query.rows[0]);
});


//free apis aren't compatible enough with each other for this
/*
//deezer api to search for tracks
router.get('/search/:term', async (req, res) => {
    const response = await fetch(`https://api.deezer.com/search?q=${req.params.term}`, {
        method: 'GET'
    });
    const parseRes = await response.json();
    //console.log(parseRes.data);
    res.json(parseRes.data);
})

//lyrics.ovh api for lyrics
router.get('/:artist/:title', async (req, res) => {
    const response = await fetch(`https://api.lyrics.ovh/v1/${req.params.artist}/${req.params.title}`, {
        method: 'GET'
    });
    //console.log(response)
    const parseRes = await response.json();
    //console.log(parseRes.lyrics);
    res.json(parseRes.lyrics);
})*/

module.exports = router;