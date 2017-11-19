'use strict';
const SlaxServer = require('skylark-slax-nodeserver'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    fs = require('fs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    exphbs = require('express-handlebars'),
    backupDb = require('./backend/exts/schedule.js').backupDb,
    funcs = require('./backend/auth/functions.js'),
    chalk = require('chalk'),
    slaxAppName = "warranty",
    routes = require('./backend/routes/routes'),
    replacestream = require('replacestream');

require('./backend/auth/passport.js');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect('/signin')
    res.json({ status: false, msg: "please login!" });
}

SlaxServer.prototype.startBackend = function(callback) {
    let app = this._express;
    if (app) {
        app.set('views', path.join(__dirname, 'views'));
        app.engine('handlebars', exphbs.create({
            defaultLayout: 'main',
            layoutsDir: path.join(__dirname, 'views/layouts'),
            partialsDir: path.join(__dirname, 'views/partials')
        }).engine);
        app.set('view engine', 'handlebars');

        // uncomment after placing your favicon in /public
        // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(logger('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(methodOverride('X-HTTP-Method-Override'));
        app.use(session({
            secret: 'supernova',
            saveUninitialized: true,
            resave: false,
            cookie: {
                httpOnly: true,
                maxAge: 3600000 // see below
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        // Session-persisted message middleware
        app.use(function(req, res, next) {
            let err = req.session.error,
                msg = req.session.notice,
                success = req.session.success;

            delete req.session.error;
            delete req.session.success;
            delete req.session.notice;

            if (err) res.locals.error = err;
            if (msg) res.locals.notice = msg;
            if (success) res.locals.success = success;

            next();
        });

        routes(app, ensureAuthenticated, this.root);

        backupDb();
    }
}

SlaxServer.prototype.extendSpaRoutes = function() {
    let app = this._express,
        slaxAppDir = this.cachePath + "/apps/" + slaxAppName;
    console.log(slaxAppDir);
    app.get('/admin', ensureAuthenticated, function(req, res) {
        let html = path.join(slaxAppDir, "index.html");
        res.setHeader('content-type', 'text/html');
        let replacement = `</title><base href="/admin/">`;
        fs.createReadStream(html).pipe(replacestream('</title>', replacement)).pipe(res);
    });
}

function serve(slaxApp, options) {
    options.slax = slaxApp;
    let server = new SlaxServer(options);

    server.start(function() {
        console.log(chalk.blue('*'), 'slax server successfully started.');
        console.log(chalk.blue('*'), 'Serving files at:', chalk.cyan('http://localhost:' + options.port));
        console.log(chalk.blue('*'), 'Press', chalk.yellow.bold('Ctrl+C'), 'to shutdown.');
        return server;
    });
    server.startBackend();
}
const npm_argv = JSON.parse(process.env.npm_config_argv || "{}");

if (!(npm_argv && npm_argv.cooked instanceof Array)) {
    throw TypeError("npm argv Error"); // 异常的抛出会终止npm install命令
}

serve("deploy/" + slaxAppName + ".slax", {
    port: npm_argv.cooked[3] || 8087,
    root: path.join(__dirname, 'src')
});
