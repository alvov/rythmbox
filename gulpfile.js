var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var size = require('gulp-size');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var nodeResolve = require('resolve');

var VENDOR_MODULES = ['react', 'flux', 'events'];

gulp.task('vendor', function() {
    var b = browserify();
    b.add(require.resolve('babelify/polyfill'));
    VENDOR_MODULES.forEach(function(id) {
        b.require(nodeResolve.sync(id), { expose: id });
    });
    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('./js/'));
});

gulp.task('js', function() {
    var b = browserify({
        entries: ['./js/app.js'],
        transform: [babelify]
    });
    VENDOR_MODULES.forEach(function(id) {
        b.external(id);
    });
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(size())
        .pipe(gulp.dest('./js/'));
});

gulp.task('css', function() {
    gulp.src('./css/*.styl')
        .pipe(stylus({
            compress: false,
            linenos: false
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('build', ['js', 'css']);

gulp.task('watch', ['js', 'css'], function() {
    gulp.watch('./js/**/*.js', ['js']);
    gulp.watch('./css/*.styl', ['css']);
});
