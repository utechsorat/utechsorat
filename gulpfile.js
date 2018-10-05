const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
var reload = browserSync.reload;

// move js files to public/js
gulp.task('js', function(){
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
  .pipe(gulp.dest("public/js"))
});

// // move fonts folder to public/fonts
// gulp.task('fonts', function(){
//   return gulp.src('node_modules/font-awesome/fonts/*')
//   .pipe(gulp.dest("public/fonts"));
// });

// // move font awesome css to public/css
// gulp.task('fa', function(){
//   return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
//   .pipe(gulp.dest("public/css"));
// });

// move fonts folder to public/fonts
gulp.task('fonts', function(){
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
  .pipe(gulp.dest("public/fonts"));
});

// move font awesome css to public/css
gulp.task('fa', function(){
  return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.css')
  .pipe(gulp.dest("public/css"));
});


// compile sass
gulp.task('sass', function(){
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'])
  .pipe(sass())
  .pipe(gulp.dest("public/css"))
  .pipe(browserSync.stream())
  .pipe(reload({stream:true}));
});



gulp.task('browser-sync', function(){
  browserSync({
    proxy: "localhost:3000"
  });
});

gulp.task('default', ['js', 'fa', 'fonts', 'sass', 'browser-sync'], function(){
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'], ['sass']);
});