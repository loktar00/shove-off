var gulp        = require('gulp'),
    connect     = require('gulp-connect'),
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less'),
    rename      = require('gulp-rename');


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
        root: '.',
        livereload : true
    });
});

gulp.task('watcher', function(){
    var jsWatcher = gulp.watch(['src/*.js'], ['js']);
        jsWatcher.on('change', function(event){
            console.log('file' + event.path + ' was ' + event.type + ', building js...');
        });

    var lessWatcher = gulp.watch(['src/*.less'], ['less']);
        lessWatcher.on('change', function(event){
            console.log('file' + event.path + ' was ' + event.type + ', building css...');
        });
});

gulp.task('default', ['watcher', 'webserver', 'js', 'less']);