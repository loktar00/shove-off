var gulp        = require('gulp'),
    connect     = require('gulp-connect'),
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less'),
    rename      = require('gulp-rename'),
    deploy      = require("gulp-gh-pages");


gulp.task('js', function(){
    return gulp.src('src/*.js')
    .pipe(uglify())
    .on('error', function(err){
        console.log(err.toString());
        this.emit('end');
    })
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});

gulp.task('less', function () {
    return gulp.src('src/*.less')
        .pipe(less())
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('dist/'));
});

gulp.task('webserver', function(){
    return connect.server({
        root: './examples',
        livereload : true
    });
});

// copy everything to the examples directory
gulp.task('examples', ['js', 'less'], function(){
    gulp.src('dist/*.js')
    .pipe(gulp.dest('examples/js/'));

    gulp.src('dist/*.css')
    .pipe(gulp.dest('examples/css/'))

    gulp.src('bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('examples/js/'))
})

gulp.task('watcher', function(){
    var jsWatcher = gulp.watch(['src/*.js'], ['js', 'examples']);
        jsWatcher.on('change', function(event){
            console.log('file' + event.path + ' was ' + event.type + ', building js...');
        });

    var lessWatcher = gulp.watch(['src/*.less'], ['less', 'examples']);
        lessWatcher.on('change', function(event){
            console.log('file' + event.path + ' was ' + event.type + ', building css...');
        });
});


gulp.task('deploy', function () {
    gulp.src("./examples/**/*")
        .pipe(deploy());
});

gulp.task('default', ['watcher', 'webserver', 'js', 'less', 'examples']);