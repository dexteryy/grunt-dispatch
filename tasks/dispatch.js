
module.exports = function(grunt) {

    var path = require('path');

    grunt.registerMultiTask('dispatch', '', function() {
        var opt = this.options();
        var pkgname = this.target;
        var data = this.data.use;
        var cwd = path.join(opt.directory, pkgname);
        if (Array.isArray(data)) {
            data.forEach(function(files){
                var true_cwd = path.join(cwd, files.cwd || '');
                var src = grunt.file.expand({ 
                    cwd: true_cwd
                }, files.src);
                src.forEach(function(src){
                    var true_src = path.join(true_cwd, src);
                    if (grunt.file.isFile(true_src)) {
                        grunt.log.writeln('Copying ' + true_src.cyan + ' -> ' + files.dest.cyan);
                        grunt.file.copy(true_src, path.join(files.dest, src.replace(files.cwd, '')));
                    }
                });
            });
        } else {
            Object.keys(data).forEach(function(dest){
                var src = grunt.file.expand({ 
                    cwd: cwd
                }, this[dest]);
                src.forEach(function(src){
                    var true_src = path.join(cwd, src);
                    if (grunt.file.isFile(true_src)) {
                        grunt.log.writeln('Copying ' + true_src.cyan + ' -> ' + dest.cyan);
                        grunt.file.copy(true_src, path.join(dest, src));
                    }
                });
            }, data);
        }
    });

    function detect_type(path) {
        if (grunt.util._.endsWith(path, '/')) {
            return 'directory';
        } else {
            return 'file';
        }
    }
    

};
