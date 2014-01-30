// Initialise Gulp
var gulp =     require('gulp'),
    p =        require('gulp-load-plugins')({camelize: true}),
    lr =       require('tiny-lr')(),
    path =     require('path'),
    express =  require('express'),
    app =      express(),
    pkg =      require('./package.json');

// Directory configs
var config = {
  port: 8111,
  src: 'vendor/assets/',
  dev: '.tmp',
  dist: 'dist2/',
  autoprefixer: ['last 2 version', '> 1%', 'ie 9', 'ie 8'],

};

gulp.task('sass:dev', function(){
  return gulp.src(config.src + 'stylesheets/*-dist.scss')
    .pipe(p.sass({
      includePaths: ['app/bower_components/'],
      outputStyle: 'expanded'
    }))
    .pipe(p.autoprefixer.apply(null, config.autoprefixer))
    .pipe(p.rename(function(dir,base,ext){
      return base.replace('-dist') + ext;
    }))
    .pipe(gulp.dest(config.dev));
});

// Compile the distribution versions of the CSS
gulp.task('sass:dist', function(){
  return gulp.src(config.src + 'stylesheets/*-dist.scss')
    .pipe(p.sass({
      includePaths: ['app/bower_components/'],
      outputStyle: 'expanded'
    }))
    .pipe(p.autoprefixer.apply(null, config.autoprefixer))
    .pipe(p.rename(function(dir,base,ext){
      return base.replace('-dist') + ext;
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(p.minifyCss())
    .pipe(p.rename(function(dir,base,ext){
      return base + '.min' + ext;
    }))
    .pipe(gulp.dest(config.dist));
});



gulp.task('clean:dev', function(){
  return gulp.src([config.dev], {read: false}).pipe(p.clean());
});

gulp.task('clean:dist', function(){
  return gulp.src([config.dist], {read: false}).pipe(p.clean());
});


gulp.task('fonts:dev', function(){
  gulp.src('app/bower_components/**/fonts/*').pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('fonts:dist', function(){
  gulp.src('app/bower_components/**/fonts/*').pipe(gulp.dest('dist/fonts'));
});


gulp.task('scripts', function(){
  gulp.src('app/scripts/*').pipe(gulp.dest('dist/fonts'));
});

gulp.task('lint', function() {
  return gulp.src('app/scripts/*.js')
    .pipe(p.jshint())
    .pipe(p.jshint.reporter('jshint-stylish'));
});

gulp.task('lr', function(){
  lr.listen(config.lr, function(err){
    if (err) {
      return console.log(err);
    }
  });
});

// Start an express server, pointing to the correct directories
gulp.task('server', ['lr', 'clean:dev', 'sass:dev', 'fonts:dev'], function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(require('connect-livereload')({
    port: config.port + 1
  }));
  app.listen(config.port);
});

gulp.task('open', ['server'], function(){
  gulp.src('app/index.html')
    .pipe(
      p.open(''),
      {app: 'google-chrome', url: 'http://localhost:' + config.port}
    );
});

gulp.task('watch', ['open'], function(){

  gulp.watch('vendor/assets/stylesheets/**/*.scss', ['sass:dev']);

  gulp.watch(['.tmp/**/*', 'app/*.html'], function(event){
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);

    lr.changed({
      body: {
        files: [fileName]
      }
    });
  });
});


// Bump Version Numbers
function bumpJsonVersions(type) {
  type = type || 'patch';

  gulp.src(['./bower.json', './package.json'])
    .pipe(p.bump({type: type}))
    .pipe(gulp.dest('./'))
    .pipe(bumpRubyVersion());
}

function bumpRubyVersion(){
  var map = require('map-stream');

  return map( function(file, cb) {
    var json = JSON.parse(file.contents.toString());

    gulp.src('lib/fundly/style/guide/version.rb')
      .pipe(p.replace(/VERSION.*\n/g, 'VERSION = "' + json.version + '"\n'))
      .pipe(gulp.dest('lib/fundly/style/guide/'));

    cb(null, file)
  });
}

gulp.task('bump:major', function(){ bumpJsonVersions('major'); });
gulp.task('bump:minor', function(){ bumpJsonVersions('minor'); });
gulp.task('bump:patch', function(){ bumpJsonVersions('patch'); });


/*
Workflow:development - gulp watch
  - scss, js or html file changes
  - preprocess
  - save processed css and fonts to .tmp
  - notify livereload
  - browser updates

Workflow:distribution - gulp build
  - clean /dist
  - preprocess scss
  - minify css
  - save to /dist
  - move fonts, js, html
  - bump version number
  - tag version number
  - release to Github
*/