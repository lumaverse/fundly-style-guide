// Initialise Gulp and dependancies
var gulp =     require('gulp'),
    p =        require('gulp-load-plugins')({camelize: true}),
    lr =       require('tiny-lr')(),
    connect =  require('connect'),
    open =     require('open'),
    pkg =      require('./package.json');

// Directory configs
var config = {
  port: 8111,
  src: 'vendor/assets/',
  dev: '.tmp',
  dist: 'dist/',
  autoprefixer: ['last 2 version', '> 1%', 'ie 9', 'ie 8'],
};

// Create a banner for distribution builds
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  '\n',
  ' * @author     <%= pkg.author %>',
  ' * @repository <%= pkg.repository.url %>',
  ' * @link       <%= pkg.homepage %>',
  ' * @license    <%= pkg.license %>',
  ' */',
  '\n\n'].join('\n');


// -----
// Tasks
// -----

gulp.task('sass:dev', function(){
  return gulp.src(config.src + 'stylesheets/*-dist.scss')
    .pipe(p.sass({
      includePaths: ['app/bower_components/'],
      outputStyle: 'expanded',
      errLogToConsole: true
    }))
    .pipe(p.autoprefixer.apply(null, config.autoprefixer))
    .pipe(p.rename(function(dir,base,ext){
      return base.replace('-dist', '') + ext;
    }))
    .pipe(gulp.dest(config.dev));
});

gulp.task('sass:dist', ['clean:dist'], function(){
  return gulp.src(config.src + 'stylesheets/*-dist.scss')
    .pipe(p.sass({
      includePaths: ['app/bower_components/'],
      outputStyle: 'expanded'
    }))
    .pipe(p.autoprefixer.apply(null, config.autoprefixer))
    .pipe(p.header(banner, { pkg : pkg } ))
    .pipe(p.rename(function(dir,base,ext){
      return base.replace('-dist', '') + ext;
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(p.minifyCss())
    .pipe(p.header(banner, { pkg : pkg } ))
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

gulp.task('fonts:dev', ['clean:dev'], function(){
  return gulp.src([
      'app/bower_components/font-awesome/fonts/*',
      'app/bower_components/fundly-icon-font/dist/fonts/*'
    ])
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('fonts:dist', ['clean:dist'], function(){
  return gulp.src([
      'app/bower_components/font-awesome/fonts/*',
      'app/bower_components/fundly-icon-font/dist/fonts/*'
    ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('lr', function(){
  lr.listen(config.port + 1, function(err){
    if (err) {
      return console.log(err);
    } else {
      p.util.log(
        'Livereload running on:',
        p.util.colors.magenta(config.port + 1)
      );
    }
  });
});

gulp.task('server', ['lr', 'fonts:dev', 'sass:dev'], function(){
  var middleware = [
    require('connect-livereload')({ port: config.port + 1 }),
    connect.static('app'),
    connect.static('.tmp'),
    connect.directory('app')
  ];

  var app = connect.apply(null, middleware),
      server = require('http').createServer(app);

  server
    .listen(config.port)
    .on('listening', function() {
      p.util.log(
        'Started connect webserver on: ',
        p.util.colors.magenta('http://localhost:' + (config.port + 1))
      );
      open('http://localhost:' + config.port);
    });
});

gulp.task('watch', ['server'], function(){
  // watch the stylesheets and compile the CSS on change
  gulp.watch('vendor/assets/stylesheets/**/*.scss', ['sass:dev']);

  // watch the .tmp directory and app html and reload the browser
  gulp.watch(
    ['.tmp/**/*', 'app/*.html', 'app/scripts/**/*.js'],
    function(event){
    p.util.log('file changed:', p.util.colors.green(event.path));
    gulp.src(event.path).pipe(p.livereload(lr));
  });
});

gulp.task('build', ['clean:dist', 'fonts:dist', 'sass:dist'], function(){
  gulp.src(['app/*.html']).pipe(gulp.dest('dist/'));
  gulp.src(['app/images/**/*']).pipe(gulp.dest('dist/images'));
  gulp.src(['app/scripts/**/*']).pipe(gulp.dest('dist/scripts'));
});


// ---------
// Versioning Tasks
// ---------

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

// ---------
// End Versioning Tasks
// ---------



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