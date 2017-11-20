const passport = require('passport'),
    api = require("./_api");

module.exports = function(app, router, ensureAuthenticated, rootPath) {
    api(app, router, ensureAuthenticated, rootPath);
    app.post('/registry', passport.authenticate('local-signup'), function(req, res) {
        let result = req.result
        if (result.status) {
            let user = result.user;
            console.log("REGISTERED: " + user.username);
            res.json({ status: true, msg: result.msg });
        } else {
            console.log("COULD NOT REGISTER");
            //inform user could not log them in
            res.json({ status: false, msg: result.msg });
        }
    });

    app.get('/reset_password', passport.authenticate('local-signup'), function(req, res) {
        let user = req.user;
        if (user) {
            console.log("REGISTERED: " + user.username);
            res.json({ status: true, msg: 'Successful created new user.' });
        }
        if (!user) {
            console.log("COULD NOT REGISTER");
            //inform user could not log them in
            res.json({ status: false, msg: 'That username is already in use, please try a different one.' });
        }
    });

    //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
    // app.post('/login', passport.authenticate('local-signin', {
    //     successRedirect: '/',
    //     failureRedirect: '/signin'
    // }));
    //
    app.post('/login', passport.authenticate('local-signin'), function(req, res) {
        res.json(req.result);
    });

    //logs user out of site, deleting them from the session, and returns to homepage
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
        req.session.notice = "You have successfully been logged out!";
    });
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        // let err = new Error('Not Found');
        // err.status = 404;
        next();
    });
};
