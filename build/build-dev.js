const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('compile-css', () => {
    return gulp.src(['../src/lib/style/iview-editor.less'])
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('../dist/'));
});

gulp.task('auto', () => {
    gulp.watch('../src/**/*.less', ['compile-css']);
});

gulp.task('default', ['compile-css', 'auto']);
