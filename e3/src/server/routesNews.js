const express = require('express');

const newsRoutes = express.Router();

const News = require('./models/news');
const Category = require('./models/category');

// get all newss in the db
newsRoutes.route('/all').get((req, res, next) => {
    var cond = {};
    if (req.query.display) {
        cond = {
            activate: true,
        };
    }
    //console.log(News.find(cond));
    //console.log(News.find(cond).populate({ path: 'category', match: cond }));
    News.find(cond)
        .populate({ path: 'category', match: cond })
        .exec((err, newss) => {
            if (err) {
                return next(new Error(err));
            }
            var newsEach = newss;
            newsEach.forEach((element, index) => {
                if (element.category == null) newss.splice(index, 1);
            });

            return res.json(newss);
        });
});

// create a news item
newsRoutes.route('/add').post((req, res) => {
    io.sockets.emit('refreshCategory', {});
    News.create(
        {
            titre: req.body.titre,
            description: req.body.description,
            activate: req.body.activate,
            frequence: req.body.frequence,
            nbDisplay: req.body.nbDisplay,
            category: req.body.category,
        },
        async (error, news) => {
            if (error) {
                res.status(400).send('Unable to create news list');
            }
            await Category.findByIdAndUpdate(
                req.body.category,
                { $push: { news: news._id } },
                { new: true, useFindAndModify: true }
            );
            io.sockets.emit('refreshCategory', {});
            io.sockets.emit('refreshNews', {});
            res.status(200).json(news);
        }
    );
});

// delete a news item
newsRoutes.route('/delete/:id').get((req, res, next) => {
    let id = req.params.id;
    News.findByIdAndRemove(id, async (err, news) => {
        if (err) {
            return next(new Error('News was not found'));
        }
        await Category.findByIdAndUpdate(
            news.category,
            { $pull: { news: news._id } },
            { new: true, useFindAndModify: true }
        );

        io.sockets.emit('refreshCategory', {});
        io.sockets.emit('refreshNews', {});
        return res.json('Successfully removed');
    });
});

// perform update on news item
newsRoutes.route('/update/:id').post((req, res, next) => {
    io.sockets.emit('refreshCategory', {});
    let id = req.params.id;

    News.findById(id, (error, news) => {
        if (error) {
            return next(new Error('News was not found'));
        }
        var oldCategory = news.category;
        news.titre = req.body.titre;
        news.description = req.body.description;
        news.activate = req.body.activate;
        news.frequence = req.body.frequence;
        news.category = req.body.category;
        news.save(async function(err, savednews) {
            if (err) {
                return res.status(400).send('Unable to update news');
            } else {
                await Category.findByIdAndUpdate(
                    oldCategory,
                    { $pull: { news: news._id } },
                    { new: true, useFindAndModify: true }
                );
                await Category.findByIdAndUpdate(
                    news.category,
                    { $push: { news: news._id } },
                    { new: true, useFindAndModify: true }
                );
                io.sockets.emit('refreshCategory', {});
                io.sockets.emit('refreshNews', {});
                return res.status(200).json(savednews);
            }
        });
    });
});

module.exports = newsRoutes;
