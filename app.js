var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

var indexRouter = require('./routes/index');
var pageRouter = require('./routes/page');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname));

app.use('/', indexRouter);
app.use('/page', pageRouter);

const webpush = require('web-push');
// Umjesto baze podataka, čuvam pretplate u
// datoteci:
let subscriptions = [];

app.post("/saveSubscription", function (req, res) {
    let sub = req.body.sub;
    subscriptions.push(sub);
    res.json({
        success: true
    });
});

function periodic_push() {
    webpush.setVapidDetails('mailto:id52316@fer.hr',
        'BOe_LmwxtiiKUXPtfNHOuPvSQb7tyukYBIjmGg8Q5tSQQ84Syr30pdLwdQuFRrCaqphzgriwHxDta2lBAnqLWok',
        'Ned9YetVMoYdPaEOX5dA-NJZm0estqPofq1Fm7fzMfk');
    subscriptions.forEach(sub => {
            webpush.sendNotification(sub, JSON.stringify({
                title: 'Background sync',
                body: 'Background sync happened'
            })).catch((error) => {
                console.log(error)
            })
    });
}

app.get("/random", (req, res) => {
    periodic_push()
    res.json({
        success: true
    });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
