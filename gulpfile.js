/*
Copyright 2014 Fabian Cook
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
limitations under the License.
*/
var gulp   = require( 'gulp' ),
    coffee = require( 'gulp-coffee' ),
    mkDir  = require( 'mkdirp'),
    rimRaf = require( 'gulp-rimraf'),
    path   = require( 'path' );


gulp.task('clean', function(){
    return gulp.src( 'dist' )
            .pipe( rimRaf( { force: true } ));
});

gulp.task('make', [ 'clean' ], function(done){
    mkDir( 'dist', done);
});

gulp.task('coffee', [ 'make' ], function(){
    return gulp.src( path.join( 'src', '**', '*.coffee' ) )
        .pipe( coffee( { bare: true } ) )
        .pipe( gulp.dest( 'dist' ) );
});


gulp.task('build', ['clean', 'make', 'coffee']);
gulp.task('default', ['build']);