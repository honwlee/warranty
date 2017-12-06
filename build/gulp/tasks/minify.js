var gulp = require('gulp'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    livereload = require('gulp-livereload'),
    sourceMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    onError = require('../utils/handleErrors'),
    util = require('../utils');

var src = [util.src + '**/*.js'];
var dest = util.dest;

module.exports = function() {
    gulp.src(util.lib + "**/*")
        .pipe(gulp.dest(dest + "lib"));
    gulp.src(util.assetSrc + "**/*")
        .pipe(gulp.dest(dest + "assets"));
    gulp.src(util.src + '**//*.+(html|hbs|handerbars)')
        .pipe(gulp.dest(dest));
    gulp.src(util.src + '**//*.json')
        .pipe(gulp.dest(dest));
    gulp.src(util.src + '**//*.+(png|jpg|jpeg|gif)')
        .pipe(gulp.dest(dest));
    return gulp.src(src)
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write().on('error', onError))
        .pipe(uglify().on('error', onError))
        .pipe(header(util.banner, {
            pkg: util.pkg
        }))
        .pipe(gulp.dest(dest));
};