var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var inject = require('gulp-inject');
var inquirer = require('inquirer');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

var appFiles = ['client/**/*.css','client/**/*.js'];
var jsFiles = appFiles[1];
var LOCAL_API = 'http://localhost:8080/api';
var PROD_API = 'https://yourapi.com/api';


gulp.task('devServer', function() {
 connect.server({
  root: 'client',
  port: 3000,
  livereload: false
  });
});


gulp.task('API', function (done) {
  var questions = [{
    type: 'rawlist',
    name: 'api',
    message: 'Which API do you want to use?',
    choices: [{
      name: 'localhost:8080',
      value: LOCAL_API
    }, {
      name: 'heroku',
      value: PROD_API
    }]
  }];

  inquirer.prompt(questions, function (answers) {
    replaceApi(answers.api,done);

  });
});


function replaceApi(choice,done) {
  if (choice === PROD_API) {
    return gulp.src(['client/app/app.js'])
      .pipe(replace(LOCAL_API, PROD_API))
      .pipe(gulp.dest('client/app/')).on('end', done);
  } else {
    return gulp.src(['client/app/app.js'])
      .pipe(replace(PROD_API, LOCAL_API))
      .pipe(gulp.dest('client/app/')).on('end', done);
  }
}

function inject(){
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


gulp.task('default', function (cb) {
  runSequence('API', 'lint', 'devServer', 'watch', cb);
});
