// 引入 gulp
var gulp = require('gulp');

var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var staticcache = require('gulp-static-cache');

gulp.task('css', function () {
    gulp.src(['./public/src/css/normalize.css', './public/src/css/style.css', './public/src/css/big.css'])
	    .pipe(concat('chat.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./public/build/css'));
});
gulp.task('js', function () {
    gulp.src([
        './public/src/js/operate.js', 
        './public/src/js/base.js', 
        './public/src/js/qv.js', 
        './public/src/js/event.js'
        ])
        .pipe(concat('chat.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('./public/build/js'));
});
gulp.task('img', function () {
    gulp.src('./public/src/img/**/**')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('./public/build/img'));
});

gulp.task('copyjs', function(){
    return gulp.src([
	    './public/src/js/operate.js',
	    './public/src/js/base.js',
	    './public/src/js/qv.js',
	    './public/src/js/event.js'
    ])
	    .pipe(concat('chat.js'))
	    //.pipe(uglify())
	    .pipe(gulp.dest('./public/build/js'));
});
gulp.task('copycss', function(){
    return gulp.src(['./public/src/css/normalize.css', './public/src/css/style.css', './public/src/css/big.css'])
	    .pipe(concat('chat.css'))
	    //.pipe(minifycss())
        .pipe(gulp.dest('./public/build/css'));
});
gulp.task('copyimg', function(){
    return gulp.src(['./public/src/img/**'])
	    //.pipe(minifycss())
        .pipe(gulp.dest('./public/build/img'));
});

gulp.task('cache', ['css', 'js', 'img'], function(){
    return gulp.src('./views/**')
        .pipe(staticcache({
          relativeUrls: './public/src/build/'
        }))
        .pipe(gulp.dest('./views'));
});

gulp.task('dev', function(){
    gulp.run(['copyjs','copycss', 'copyimg']);
    gulp.watch([
	    './public/src/js/operate.js',
	    './public/src/js/base.js',
	    './public/src/js/qv.js',
	    './public/src/js/event.js'
    ], ['copyjs']);
    gulp.watch(['./public/src/css/normalize.css', './public/src/css/style.css', './public/src/css/big.css'], ['copycss']);
    gulp.watch(['./public/src/img/**'], ['copyimg']);
});
// 上线文件
gulp.task('default', function(){
    gulp.run('cache');
});