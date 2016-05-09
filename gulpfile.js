'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var reload = browserSync.reload;

// watch files for changes and reload

gulp.task('default',['sass', 'sass:watch', 'serve']);

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './app'
    }
  });

  gulp.watch(['*.html', './app/css/*.css', './app/js/*.js'], {cwd: 'app'}, reload);
});

gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/style.scss', ['sass']);
});
