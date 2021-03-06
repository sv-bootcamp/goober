//Include required modules
import babel from 'gulp-babel';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import configify from 'config-browserify';
import changed from 'gulp-changed';
import envify from 'envify';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gutil from 'gulp-util';
import jsonlint from 'gulp-jsonlint';
import nodemon from 'gulp-nodemon';
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import unitest from 'unitest';
import lab from 'gulp-lab';
import apidoc from 'gulp-apidoc';

//Default task. This will be run when no task is passed in arguments to gulp
gulp.task('default', ['watch']);

gulp.task('build:static', ['clean:static'], () =>
  gulp.src('./src/client/static/**/*')
    .pipe(gulp.dest('./dist-client/static'))
);

//Convert ES6 code in all js files in src/js folder and copy to
//build folder as bundle.js
gulp.task('build:client', ['build:clientjs', 'build:clientcss', 'build:static']);

gulp.task('build:clientjs', ['clean:clientjs'], () => compileClientJS(['./src/client/javascripts/main.js'], 'main.js', './dist-client/javascripts'));

gulp.task('build:clientcss', ['clean:clientcss'], () => compileClientCSS('./src/client/stylesheets/**/*.css', './dist-client/stylesheets'));

gulp.task('build:server', ['clean:server'], () => compileNodeJS('src/{server,shared}/**/*.js', './dist-server'));

gulp.task('build', ['build:client', 'build:server']);

// gulp.task('build:test-client', ['clean:test'], () => compileClientJS(['src/test/.setup.js', './src/test/browser/index.js'], 'index.js', './dist-test/test/browser').pipe(lab()));

gulp.task('build:test-client', ['clean:test'], () => gulp.src(['src/test/.setup.js', 'src/test/browser/components/*.js'])
  .pipe(lab())
);

gulp.task('build:test-server', ['clean:test'], () => compileNodeJS(['src/!(client)/!(browser)/**/*.js', 'src/!(client)/*.js'], './dist-test'));

gulp.task('build:test-json', ['clean:test'], () => gulp.src('src/**/*.json')
  .pipe(changed('src/**/*.json'))
  .pipe(gulp.dest('./dist-test/'))
);

gulp.task('build:test', ['build:test-server', 'build:test-client', 'build:test-json']);

gulp.task('clean:test', () => rimraf.sync('./dist-test'));

gulp.task('clean:client', () => rimraf.sync('./dist-client'));

gulp.task('clean:clientjs', () => rimraf.sync('./dist-client/javascripts'));

gulp.task('clean:clientcss', () => rimraf.sync('./dist-client/stylesheets'));

gulp.task('clean:static', () => rimraf.sync('./dist-client/static'));

gulp.task('clean:server', () => rimraf.sync('./dist-server'));

gulp.task('clean', ['clean:test', 'clean:server', 'clean:client', 'clean:apidoc']);

gulp.task('clean:apidoc', () => rimraf.sync('./doc'));

gulp.task('apidoc', ['clean:apidoc'], function(done){
  apidoc( apidocConfig ,done);
});

gulp.task('run:eslint', () => gulp.src('src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.results(lintReporter))
  .pipe(eslint.failAfterError())
);

gulp.task('run:jsonlint', () => gulp.src(['**/*.json', '!node_modules/**'])
  .pipe(jsonlint())
  .pipe(jsonlint.reporter(lintReporter))
  .pipe(jsonlint.failAfterError())
);

gulp.task('run:test', ['build:test'], () => {
  const output = unitest({
    node: 'dist-test/test/node/index.js',
    report: ['text']
  }, (exitCode) => {
    if (exitCode !== 0) {
      console.error('Tests failed! - Test script exited with non-zero status code.');
    }
    process.exitCode = exitCode;
    return true;
  });
  output.pipe(process.stdout);
});

gulp.task('lint', ['run:eslint', 'run:jsonlint']);
gulp.task('test', ['lint', 'run:test']);

gulp.task('watch', ['build', 'apidoc'], () => {
  nodemon({
    script: 'server.js',
    watch: ['src'],
    tasks: ['build'],
    env: {'NODE_ENV': 'development'}
  });
  gulp.watch('./src/client/stylesheets/**/*.css', ['build:clientcss']);
});

gulp.task('server', ['build'], () => {
  nodemon({
    script: 'server.js',
    watch: false,
    env: {'NODE_ENV': 'production'}
  })
});


const compileClientJS = (entries, destName, destDir) =>
  browserify({
    entries: entries
  })
    .transform(babelify)
    .transform(configify)
    .transform(envify)
    .bundle()
    .pipe(source(destName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destDir));

const compileClientCSS = (src, destDir) =>
  gulp.src(src)
    .pipe(gulp.dest(destDir));



// Compile js to be run in node and dependent sources using babel
// with options specified
// in ./babelrc and place them in dest. Works for server and test js.
const compileNodeJS = (src, dest) =>
  gulp.src(src)
    .pipe(changed(dest))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write({
      includeContent: false,
      sourceRoot: (file) => file.base
    }))
    .pipe(gulp.dest(dest));


const lintReporter = (results) => {
  const logColor = results.errorCount ? gutil.colors.red : gutil.colors.green;
  gutil.log('Total Results: ' + results.length);
  gutil.log('Total Warnings: ' + results.warningCount);
  gutil.log(logColor('Total Errors: ' + results.errorCount));
};


const apidocConfig = {
  src: [
    './src/server/routes',
    './src/server/items',
    './src/server/images',
    './src/server/users',
    './src/server/reports',
    './src/server/auth'],
  dest: 'doc/',
  debug: true,
  config: './'
};
