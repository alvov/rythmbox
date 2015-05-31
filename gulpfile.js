var gulp = require('gulp');
var browserify = require('browserify');
var toVinyl = require('vinyl-source-stream');
var reactify = require('reactify');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var nodeResolve = require('resolve');

var VENDOR_MODULES = ['react', 'flux', 'object-assign', 'events'];

gulp.task('vendor', function() {
    var b = browserify();
    VENDOR_MODULES.forEach(function(id) {
        b.require(nodeResolve.sync(id), { expose: id });
    });
    return b.bundle()
        .pipe(toVinyl('vendor.js'))
        .pipe(gulp.dest('./js/'));
});

gulp.task('js', function() {
    var b = browserify({
        entries: './js/app.js',
        transform: [reactify]
    });
    VENDOR_MODULES.forEach(function(id) {
        b.external(id);
    });
    return b.bundle()
        .pipe(toVinyl('bundle.js'))
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

gulp.task('watch', function() {
    gulp.watch('./js/*/*.js', ['js']);
    gulp.watch('./css/*.styl', ['css']);
});