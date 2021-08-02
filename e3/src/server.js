let express = require('express');
let morgan = require('morgan');
let path = require('path');
let cors = require('cors');
let fs = require('fs');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let config = require('./server/config');
let News = require('./server/models/news');
let Live = require('./server/models/live');

mongoose.connect(
    config.DB,
    {
        useNewUrlParser: true,
    }
);
var http = null;
if (
    fs.existsSync(process.cwd() + '/certs/privkey.pem') &&
    fs.existsSync(process.cwd() + '/certs/fullchain.pem')
) {
    http = require('https').createServer(
        {
            key: fs.readFileSync(process.cwd() + '/certs/privkey.pem'),
            cert: fs.readFileSync(process.cwd() + '/certs/fullchain.pem'),
        },
        app
    );
} else {
    http = require('http').createServer(app);
}
let actualNews = null;
var io = require('socket.io')(http);
io.on('connection', socket => {
    socket.on('forceDisplayNews', function(data) {
        News.findOne({ _id: data })
            .populate('category')
            .exec(async (err, news) => {
                if (err) {
                    return;
                }
                actualNews = news;
                news.nbDisplay++;
                news.save(async function(err, savednews) {
                    actualNews = savednews;
                    io.emit('displayNews', savednews);
                });
            });
    });
    Live.findOne({ activate: 1 }, (err, live) => {
        if (err || live == null) {
            return;
        }
        socket.emit('updateLink', live);
    });
    socket.emit('displayNews', actualNews);
});
setInterval(function() {
    if (actualNews != null) {
        if (!actualNews.timeDisplay) actualNews.timeDisplay = 0;
        actualNews.timeDisplay += 1;
    }
    if (actualNews == null || actualNews.timeDisplay > 15) {
        var cond = {
            $expr: { $lte: ['$nbDisplay', '$frequence'] },
            activate: true,
            category: { $ne: null },
        }; // collection name in db
        if (actualNews != null) {
            cond._id = { $ne: actualNews._id };
        }
        News.find(cond)
            .populate({
                path: 'category',
                match: {
                    activate: true,
                },
            })
            .exec((err, newss) => {
                var length = 0;
                if (newss.length != 0)
                    newss.forEach(async (news, index) => {
                        if (news.category != null) length++;
                    });
                if (err || length == 0) {
                    if (err) console.log(err.message);
                    News.find({ activate: true })
                        .populate('category')
                        .exec((err, newss) => {
                            if (err) {
                                console.log(err.message);
                                return;
                            }
                            newss.forEach(async (news, index) => {
                                news.nbDisplay = 0;
                                news.save(async function(err, savednews) {
                                    if (err) console.log(err.message);
                                });
                            });
                        });
                } else {
                    var skip = Math.floor(Math.random() * length);
                    var count = 0;
                    newss.forEach(async (news, index) => {
                        if (news.category != null) {
                            if (count == skip) {
                                news.nbDisplay++;
                                news.save(async function(err, savednews) {
                                    actualNews = savednews;
                                    io.emit('displayNews', savednews);
                                });
                            }
                            count++;
                        }
                    });
                }
            });
    }
}, 1000);

global.io = io;
http.listen(4001, () => {
    console.log('listening on *:' + 4001);
});
app.use(express.static(path.join(__dirname, '/public')));

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

port = config.APP_PORT || 4000;

app.listen(port);

console.log('App listening on port ' + port);

let liveRoute = require('./server/routesLive');
app.use('/api/live', liveRoute);

let newsRoute = require('./server/routesNews');
app.use('/api/news', newsRoute);

let categoryRoute = require('./server/routesCategory');
const news = require('./server/models/news');
app.use('/api/category', categoryRoute);

app.get('/', function(req, res, next) {
    res.sendFile('./public/index.html');
});
