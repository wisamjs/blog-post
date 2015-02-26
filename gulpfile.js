var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var appFiles = ['client/**/*.css','client/**/*.js'];


gulp.task('devServer', function() {
 connect.server({
  root: 'client',
  port: 3000,
  livereload: false
  });
});

gulp.task('watch', function() {
    watch(appFiles).pipe(connect.reload());

});

gulp.task('default',['devServer','watch']);