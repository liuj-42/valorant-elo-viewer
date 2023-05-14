const express = require('express');
const fs = require('fs');
const app = require('../app.cjs');

const router = express.Router();

router.post('/user', (req, res) => {
    res.redirect(`/user/${req.body.regions}/${req.body.username}/${req.body.id}`);
});

router.post('/updateTrackedPlayers', (req, res) => {
    let trackedUsers = fs.readFileSync("./user_data/track_list.txt").toString().split("\n");
    res.send(trackedUsers);

    app.updateTrackedPlayers(trackedUsers);
});

router.post('/download/:file', (req, res) => {
    const directoryPath = `./user_data/${req.params.file}`;

    res.download(directoryPath, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
});

module.exports = router;