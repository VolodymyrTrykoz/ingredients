let gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    ftp = require('vinyl-ftp'),
    notify = require('gulp-notify'),
    nunjucksRender = require('gulp-nunjucks-render'),
    babel = require('gulp-babel');

// Скрипты проекта
gulp.task('scripts', () => {
    return gulp.src([
        'app/libs/jquery-3.3.1/jquery-3.3.1.min.js',
        'app/libs/gsap/src/minified/TweenMax.min.js',
        'app/libs/gsap/src/minified/plugins/ScrollToPlugin.min.js',
        'app/js/js2015.js',
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        ghostMode: false
    });
});

gulp.task('babel', function () {
        gulp.src([
            'node_modules/babel-polyfill/dist/polyfill.js',
            'app/js/main.js'
        ]).pipe(babel({presets: ['env']}))
            .pipe(concat('js2015.js'))
            .pipe(gulp.dest('app/js'))
    }
);

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'babel', 'scripts', 'browser-sync'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/main.js', ['babel']);
    gulp.watch(['libs/**/*.js', 'app/js/main.js'], ['scripts']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'babel', 'scripts'], function () {

    var buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess'
    ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/*.css'
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/scripts.min.js'
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*']
    ).pipe(gulp.dest('dist/fonts'));
});

gulp.task('deploy', function () {
    var conn = ftp.create({
        host: 'hostname.com',
        user: 'username',
        password: 'userpassword',
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**',
        'dist/.htaccess',
    ];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function () {
    return del.sync('dist');
});
gulp.task('clearcache', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
gulp.task('default', ['watch']);