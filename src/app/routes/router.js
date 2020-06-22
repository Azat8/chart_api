module.exports = (app) => {
    app.use('/user', require('./user.router'));
    app.use('/', require('./index.router'));
    app.use(function (req, res, next) {
        console.log('Time:', Date.now());
        next()
    })
};