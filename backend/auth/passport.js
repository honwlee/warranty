const passport = require('passport'),
    funct = require('./functions.js'),
    LocalStrategy = require('passport-local');
//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy({ passReqToCallback: true }, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function(result) {
                req.result = result;
                if (result.status) {
                    let user = result.user;
                    console.log("LOGGED IN AS!!!!!!!!!!!: " + user.username);
                    done(null, result.user);
                } else {
                    console.log("COULD NOT LOG IN");
                    done(null, result.user);

                }
            })
            .fail(function(err) {
                console.log(err.body);
            });
    }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy({ passReqToCallback: true }, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        try {
            funct.localReg({
                    display: req.body.display,
                    email: req.body.email,
                    username: username,
                    password: password
                }).then(function(result) {
                    req.result = result;
                    if (result.status) {
                        let user = req.user = result.user;
                        console.log("REGISTERED: " + user.username);
                        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                        done(null, result.user);
                    } else {
                        console.log(result.msg);
                        // req.session.error = result.msg; //inform user could not log them in
                        done(null, {});
                    }
                })
                .fail(function(err) {
                    console.log(err.body);
                });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    return next();
    // if (req.isAuthenticated()) {
    //     return next();
    // }
    // req.session.error = 'Please sign in!';
    // res.redirect('/signin');
}
