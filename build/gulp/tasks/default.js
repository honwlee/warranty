var gulp = require('gulp');
var runSequence = require('run-sequence');


module.exports = function(callback) {
    return runSequence(
        'clean',
        'minify',
        'lib',
        'sass',
        'deploy',
        callback
    );
};