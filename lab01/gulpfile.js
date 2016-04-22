// 
// Inspired by:
//
// * https://github.com/ghpabs/angular2-seed-project
// * http://paislee.io/a-healthy-gulp-setup-for-angularjs-projects/
//
////


// Constants

const path = {
  src: './src',
  src_lib: './src/lib',
  index: './src/index.html',
  build: './build',
  build_app: './build/app',
  build_lib: './build/lib',
};


const dependencies_node_external = [
  'node_modules/es6-shim/es6-shim.min.js',
  'node_modules/systemjs/dist/system-polyfills.js',
  'node_modules/angular2/bundles/angular2-polyfills.js',
  'node_modules/systemjs/dist/system.src.js',
  'node_modules/rxjs/bundles/Rx.js',
  'node_modules/angular2/bundles/angular2.dev.js',
  'node_modules/angular2/bundles/router.dev.js',
  'node_modules/angular2/bundles/http.dev.js',
  'node_modules/socket.io-client/socket.io.js',
  'node_modules/intl/dist/Intl.min.js',
  'node_modules/intl/locale-data/jsonp/en.js'
];

const dependencies_node_internal = [
  path.build + '/lib/es6-shim.min.js',
  path.build + '/lib/system-polyfills.js',
  path.build + '/lib/angular2-polyfills.js',
  path.build + '/lib/system.src.js',
  path.build + '/lib/Rx.js',
  path.build + '/lib/angular2.dev.js',
  path.build + '/lib/router.dev.js',
  path.build + '/lib/http.dev.js',
  path.build + '/lib/socket.io.js',
  path.build + '/lib/Intl.min.js',
  path.build + '/lib/en.js',
  path.build + '/lib/rAF.js'
];



// Dependencies

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const tscConfig = require('./tsconfig.json');
const del = require('del');



const pipes = {};


pipes.orderedAppSources = function () {
  return plugins.angularFilesort();
};


pipes.validatedIndex = function() {
  return gulp.src(path.index)
    .pipe(plugins.htmlhint())
    .pipe(plugins.htmlhint.reporter());
};


pipes.builtVendorScriptsDev = function () {
  return gulp.src(dependencies_node_external)
    .pipe(gulp.dest(path.build_lib));
};



//
//
//
gulp.task('builtIndexDev', ['lint', 'build:dev', 'dependenciesDev', 'moveCss'], function() {

  return pipes.validatedIndex()
    .pipe(gulp.dest(path.build)) // write first to get relative path for inject
    .pipe(plugins.inject(gulp.src(dependencies_node_internal, {read: false}), {name: 'lib', relative: 'true'}))
    .pipe(gulp.dest(path.build));
});


//
//
// builds a complete Dev environment
gulp.task('default', ['builtIndexDev']);



//
// run development from build
//
gulp.task('dev', ['watch', 'serve']);



//
// serve the build dir
//
gulp.task('serve', function () {
  return gulp.src(path.build)
    .pipe(plugins.webserver({
      open: true
    }));
});



//
// watch for changes and run the relevant task
//
gulp.task('watch', function () {
  gulp.watch(path.src + '/**/*.ts', ['default']);
  gulp.watch(path.src + '/**/*.html', ['default']);
  gulp.watch(path.src + '/**/*.css', ['moveCss']);
});


//
// move dependencies into build dir
//
gulp.task('dependenciesDev', function () {
  gulp.src(path.src_lib + '/*.js')
    .pipe(gulp.dest(path.build_lib));

  return gulp.src(dependencies_node_external)
    .pipe(gulp.dest(path.build_lib));
});


// clean the contents of the build directory
gulp.task('clean', function () {
  return del([path.build + '/**/*']);
});


//
// Lint
//
gulp.task('lint', function() {
  return gulp.src(tscConfig.files)
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report('verbose'))
});


//
// move css
//
gulp.task('moveCss', function () {
  return gulp.src(path.src + '/**/*.css')
    .pipe(gulp.dest(path.build));
});


//
// Build Dev version of the app
//
gulp.task('build:dev', function () {
  var project = plugins.typescript.createProject('tsconfig.json', {
    outDir: path.build_app
  });

  return gulp.src(tscConfig.files)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.typescript(project))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(path.build_app));
});



