const express = require('express');

const liveRoutes = express.Router();

const Live = require('./models/live');

// get all lives in the db
liveRoutes.route('/all').get((req, res, next) => {
    Live.find((err, lives) => {
        if (err) {
            return next(new Error(err));
        }

        return res.json(lives);
    });
});

// create a live item
liveRoutes.route('/add').post((req, res) => {
    Live.create(
        {
            titre: req.body.titre,
            url: req.body.url,
            activate: req.body.activate,
        },
        (error, live) => {
            if (error) {
                res.status(400).send('Unable to create live list');
            }
            io.sockets.emit('refreshLive', {});
            res.status(200).json(live);
        }
    );
});

// delete a live item
liveRoutes.route('/delete/:id').get((req, res, next) => {
    let id = req.params.id;
    Live.findByIdAndRemove(id, (err, live) => {
        if (err) {
            return next(new Error('Live was not found'));
        }

        io.sockets.emit('refreshLive', {});
        return res.json('Successfully removed');
    });
});

// perform update on live item
liveRoutes.route('/update/:id').post((req, res, next) => {
    let id = req.params.id;

    Live.findById(id, (error, live) => {
        if (error) {
            return next(new Error('Live was not found'));
        }
        if (req.body.activate) {
            Live.update({ activate: 1, _id: { $ne: id } }, { $set: { activate: 0 } }, function(
                err,
                result
            ) {
                if (err) throw err;
                io.sockets.emit('updateLink', live);
            });
        }
        live.titre = req.body.titre;
        live.url = req.body.url;
        live.activate = req.body.activate;
        live.save(function(err, savedlive) {
            if (err) {
                return res.status(400).send('Unable to update live');
            } else {
                io.sockets.emit('refreshLive', {});
                return res.status(200).json(savedlive);
            }
        });
    });
});

module.exports = liveRoutes;
