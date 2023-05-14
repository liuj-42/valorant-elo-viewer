const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = require('../app.cjs');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index');
});

router.get('/data/:region/:username/:id', function (req, res) {
    let region = req.params.region; 
    let username = req.params.username;
    let id = req.params.id;

    app.consoleWrite('DATA', `Requested [${region}] ${username}#${id}`);

    axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${username}/${id}`)
        .then(response => {
            if (response.data.status == 200) {
                if (response.data.data.length > 0) {
                    res.send(response.data);
                } else {
                    res.render('pages/user/fail');
                }
            } else {
                res.render('pages/user/fail');
            }
        })
        .catch(err => {
            res.render('pages/user/fail');
        }
        );
})

router.get('/user/:region/:username/:id', function (req, res) {
    let region = req.params.region;
    let username = req.params.username;
    let id = req.params.id;

    app.consoleWrite('USER', `Requested [${region}] ${username}#${id}`);

    axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${username}/${id}`)
        .then(response1 => {
            if (response1.data.status == 200) {
                if (response1.data.data.length > 0) {
                    axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${username}/${id}`)
                        .then(response2 => {
                            if (response2.data.status == 200) {
                                if (response2.data.data != null) {
                                    res.render('pages/user/success', {
                                        mmrData: response1.data,
                                        userData: response2.data
                                    });
                                } else {
                                    res.render('pages/user/fail');
                                }
                            } else {
                                res.render('pages/user/fail');
                            }
                        })
                        .catch(err => {
                            res.render('pages/user/fail');
                        }
                        );
                } else {
                    res.render('pages/user/fail');
                }
            } else {
                res.render('pages/user/fail');
            }
        })
        .catch(err => {
            res.render('pages/user/fail');
        }
        );
})

router.get('/track', (req, res) => {
    let trackedUsers = fs.readFileSync('./user_data/track_list.txt').toString().split("\n");

    res.render('pages/track', {
        trackedUsers: trackedUsers
    });
});

router.get('/track/:file', (req, res) => {
    fs.readFile(`./user_data/${req.params.file}`, 'utf8', (err, contents) => {
        if (err) {
            console.error(err);
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(contents);
        res.end();
    });
});

router.get('/visualize', (req, res) => {
    let trackedUsers = fs.readFileSync('./user_data/track_list.txt').toString().split("\n");
    res.render('pages/visualize', {
        trackedUsers: trackedUsers
    });
});

router.get('*', (req, res) => {
    res.send('404! This is an invalid URL.');
});

module.exports = router;