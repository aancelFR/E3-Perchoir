const express = require('express');

const categoryRoutes = express.Router();

const Category = require('./models/category');
const News = require('./models/news');

// get all Categories in the db
categoryRoutes.route('/all').get((req, res, next) => {
    Category.find(async (err, categories) => {
        if (err) {
            return next(new Error(err));
        }
        return res.json(categories);
    }).populate('news');
});

// create a category item
categoryRoutes.route('/add').post((req, res) => {
    Category.create(
        {
            name: req.body.name,
            activate: req.body.activate,
            color: req.body.color,
            order: req.body.order,
        },
        (error, category) => {
            if (error) {
                res.status(400).send('Unable to create category list');
            }
            io.sockets.emit('refreshCategory', {});
            res.status(200).json(category);
        }
    );
});

// delete a category item
categoryRoutes.route('/delete/:id').get((req, res, next) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, category) => {
        if (err) {
            return next(new Error('Category was not found'));
        }

        io.sockets.emit('refreshCategory', {});
        return res.json('Successfully removed');
    });
});

// perform update on category item
categoryRoutes.route('/update/:id').post((req, res, next) => {
    let id = req.params.id;

    Category.findById(id, (error, category) => {
        if (error) {
            return next(new Error('Category was not found'));
        }

        category.name = req.body.name;
        category.activate = req.body.activate;
        category.color = req.body.color;
        category.order = req.body.order;
        category.save(function(err, savedCategory) {
            if (err) {
                return res.status(400).send('Unable to update category');
            } else {
                io.sockets.emit('refreshCategory', {});
                return res.status(200).json(savedCategory);
            }
        });
    });
});

module.exports = categoryRoutes;
