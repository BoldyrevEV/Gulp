// gulp-imageMin

let gulp = require('gulp'), //Сам gulp.
    sass = require('gulp-sass'), // компиляция sass.
    uglifyJs = require('gulp-uglifyes'), // минификация js.
    autoPrefixer = require('gulp-autoprefixer'), // Вендорные префиксы.
    concat = require('gulp-concat'), // Конкатенация.
    bs = require('browser-sync'), // Сервер.
    htmlMin = require('gulp-htmlmin'), // Минификация html.
    rename = require('gulp-rename'), // Переименование.
    delFiles = require('del'), // Удаление файлов.
    cssMinify = require('gulp-csso'), // Минификация css.
    babel = require('gulp-babel'), // Babel.
    pug = require('gulp-pug'); // Pug.

// Методы gulp.
// gulp.task() - создание задачи.
// gulp.src() - выбор файла.
// gulp.dest() - сохранение.
// gulp.parallel() - параллельный запуск задач.
// gulp.series() - последовательный запуск задач.
// gulp.watch() - следить за файлами.

gulp.task('test', () => {
    return console.log('Gulp works');
});

gulp.task('html', () => {
    return gulp.src('app/html/index.html') // Выбор файла.
        .pipe(htmlMin({collapseWhitespace: true})) //Сжатие файла.
        .pipe(gulp.dest('dist')); // Сохранение файла.
});

gulp.task('clean', () => {
    // dist/** - выбрали все что лежит в папке dist, включая саму папку dist.
    // !dist - исключили из выбора папку dist.
    return delFiles(['dist/**', '!dist']) // Удаление файлов.
});

gulp.task('sass', () => {
    // return gulp.src('app/sass/**/*.+(scss|sass)')
    // return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
    return gulp.src('app/sass/**/*.scss') // Выбор файла.
        .pipe(sass()) // Компиляция sass.
        .pipe(autoPrefixer()) // Вендорные префиксы.
        .pipe(cssMinify()) // Минификация css.
        .pipe(gulp.dest('dist/css')); // Сохранение файла.
});

gulp.task('pug', () => {
    return gulp.src('app/pug/*.pug')
        .pipe(pug({pretty: true})) // pretty - не выполнится минификация
        .pipe(gulp.dest('dist/templates'))
});

gulp.task('js:es6', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(uglifyJs()) //
        .pipe(rename({suffix: '.min'})) // Переименовали мин. файл с добавлением .min.
        .pipe(gulp.dest('dist/js'));
});

gulp.task('babel', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(babel({presets: ['@babel/env']})) // передаем настройки среды.
        .pipe(rename({suffix: '.es5'}))
        .pipe(gulp.dest('dist/js'));
});

// Поднимаем сервер.
gulp.task('server', () => {
    return bs({
        browser: 'chrome', // Выбор браузера.
        server: {
            baseDir: 'dist'
        }
    })
});

// Слежение за файлами sass
gulp.task('sass:watch', () => {
    return gulp.watch('app/sass/**/*.scss', gulp.series('sass', (done) => {
        bs.reload();
        done();
    }))
});

// Слежение за файлами js
gulp.task('js:watch', () => {
    return gulp.watch('app/js/**/*.js', gulp.series('js:es6', (done) => {
        bs.reload();
        done();
    }))
});

gulp.task('default', gulp.series('clean' , gulp.parallel('html', 'sass', 'pug', 'js:es6', 'babel'), gulp.parallel('sass:watch', 'js:watch', 'server')));