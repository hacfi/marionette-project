'use strict';

// General // ------------------------------------------------------------------

var path = require('path'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        rename: {
            'gulp-webpack': 'webpack'
        }
    }),
    webpackConfig = require('./webpack.config.js'),
    del = require('del');


gulp.task('default', ['dist']);


gulp.task('dist', ['webpack', 'less'], function () {

});

gulp.task('dev', ['webpack:dev', 'less:dev'], function () {

});


// JavaScript // ---------------------------------------------------------------

gulp.task('webpack', function () {
    return gulp
        .src(webpackConfig.entry.app)
        .pipe($.webpack(webpackConfig, null, function(err, stats) {
            //stats.compilation.hash;
            require('fs').writeFileSync(
                path.join(__dirname, 'stats.dist.json'),
                JSON.stringify(stats.toJson(), null, '\t')
            );
        }))
        .pipe($.size())
        .pipe($.uglify())
        .pipe(gulp.dest(webpackConfig.output.path))
        .pipe($.size());
});

gulp.task('webpack:dev', function () {
    return gulp
        .src(webpackConfig.entry.app)
        .pipe($.webpack(webpackConfig, null, function(err, stats) {
            require('fs').writeFileSync(
                path.join(__dirname, 'stats.dev.json'),
                JSON.stringify(stats.toJson(), null, '\t')
            );
        }))
        .pipe(gulp.dest(webpackConfig.output.path))
        .pipe($.size());
});


gulp.task('jscs', function () {
    return gulp
        .src('src/js/app.js')
        .pipe($.jscs());
});


gulp.task('jshint', function () {
    return gulp
        .src('src/js/app.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'));
});



// LESS // ---------------------------------------------------------------------

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    LessPluginCSScomb = require('less-plugin-csscomb'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    autoprefix = new LessPluginAutoPrefix({
        browsers: [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Explorer >= 8',
            'Firefox >= 24',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]
    }),
    csscomb = new LessPluginCSScomb('.csscomb.json'),
    cleancss = new LessPluginCleanCSS({ advanced: true });

gulp.task('less', function () {
    return gulp
        .src('src/less/style.less')
        .pipe($.less({
            plugins: [autoprefix, csscomb, cleancss]
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe($.size());
});

gulp.task('less:dev', function () {
    return gulp
        .src('src/less/style.less')
        .pipe($.less({
            plugins: [autoprefix, csscomb]
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe($.size());
});


gulp.task('less:lint-sorted', function () {
    return gulp
        .src('src/less/style.less')
        .pipe($.less({
            plugins: [csscomb]
        }))
        .pipe(gulp.dest('.tmp/less_lint/sorted/'))
        .pipe($.size());
});

gulp.task('less:lint-unsorted', function () {
    return gulp
        .src('src/less/style.less')
        .pipe($.less({
            plugins: []
        }))
        .pipe(gulp.dest('.tmp/less_lint/unsorted/'))
        .pipe($.size());
});

gulp.task('less:lint', ['less:lint-unsorted', 'less:lint-sorted'], function () {
    return gulp
        .src('.tmp/less_lint/sorted/style.css')
        .pipe($.diff('.tmp/less_lint/unsorted'))
        .pipe($.diff.reporter({ fail: true }));
});


// Misc // ---------------------------------------------------------------------

gulp.task('clean', ['clean:dist', 'clean:tmp']);

gulp.task('clean:dist', function(cb) {
    del([
        'dist'
    ], cb);
});

gulp.task('clean:tmp', function(cb) {
    del([
        '.tmp'
    ], cb);
});
