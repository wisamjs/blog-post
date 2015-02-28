var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var inject = require('gulp-inject');
var appFiles = ['client/**/*.css','client/**/*.js'];
var jsFiles = appFiles[1];


gulp.task('devServer', function() {
 connect.server({
  root: 'client',
  port: 3000,
  livereload: false
  });
});

function inject(){
  console.log('INJEEECTING');
 var target = gulp.src('client/index.html');
 var sources = gulp.src([jsFiles], {
  //dont need to read the files, just get the path
  read: false 
  });

 return target.pipe(inject(sources, {
   addRootSlash: false,
   ignorePath: 'client'
   //so that path doesn't start with 'client/..'
  }))
 .pipe(gulp.dest('client'));
};

gulp.task('watch', function() {
    watch(appFiles).pipe(connect.reload());


    watch(jsFiles,{events:['add','unlink']},function() {
      gulp.start(['inject']);
    });

});

gulp.task('inject', function() {
 var target = gulp.src('client/index.html');
 var sources = gulp.src([jsFiles], {
  //dont need to read the files, just get the path
  read: false 
  });

 return target.pipe(inject(sources, {
   addRootSlash: false,
   ignorePath: 'client'
   //so that path doesn't start with 'client/..'
  }))
 .pipe(gulp.dest('client'));
});

gulp.task('default',['inject','devServer','watch']);