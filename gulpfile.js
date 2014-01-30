// Initialise Gulp
var gulp = require('gulp'),
    p =    require('gulp-load-plugins')({camelize: true}),
    pkg =  require('./package.json');

// Directory configs
var config = {
  src: 'app/',
  dest: 'dist2/'
};

gulp.task('sass', function(){

  return gulp.src(config.src + 'styles/*.sass')
    .pipe(p.rubySass({
      loadPath: [
        config.src + 'bower_components/'
      ],
      compass: true,
      style: 'expanded',
      lineNumbers: true
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(p.minifyCss())
    .pipe(p.rename(function(dir,base,ext){
      return base + '.min' + ext;
    }))
    .pipe(gulp.dest(config.dest));

});


gulp.task('moveDependancies', function(){

});