
module.exports = function(grunt) {

    var path = require('path');

    grunt.registerMultiTask('dispatch', '', function() {
        var opt = this.options();
        var pkgname = this.target;
        var data = this.data.use;
        var cwd = path.join(grunt.config.process(opt.directory), pkgname);
        var tally = {
            files: 0
        };
        if (Array.isArray(data)) {
            data.forEach(function(files){
                var dest = grunt.config.process(files.dest);
                var src_cwd = grunt.config.process(files.cwd || "");
                var true_cwd = path.join(cwd, src_cwd);
                var src = files.src;
                if (Array.isArray(src)) {
                    src = src.map(function(src){
                        return grunt.config.process(src);
                    });
                }
                src = grunt.file.expand({
                    cwd: true_cwd
                }, src);
                src.forEach(function(src){
                    var true_src = path.join(true_cwd, src);
                    if (grunt.file.isFile(true_src)) {
                        grunt.verbose.writeln('Copying ' + true_src.cyan 
                            + ' -> ' + dest.cyan);
                        grunt.file.copy(true_src, 
                            path.join(dest, 
                                src.replace(new RegExp('^' + src_cwd), '')
                            )
                        );
                        tally.files++;
                    }
                });
            });
        } else {
            Object.keys(data).forEach(function(dest){
                var src = this[dest];
                dest = grunt.config.process(dest);
                if (Array.isArray(src)) {
                    src = src.map(function(src){
                        return grunt.config.process(src);
                    });
                }
                src = grunt.file.expand({
                    cwd: cwd
                }, src);
                src.forEach(function(src){
                    var true_src = path.join(cwd, src);
                    if (grunt.file.isFile(true_src)) {
                        grunt.verbose.writeln('Copying ' + true_src.cyan 
                            + ' -> ' + dest.cyan);
                        grunt.file.copy(true_src, path.join(dest, src));
                        tally.files++;
                    }
                });
            }, data);
        }
        if (tally.files) {
            grunt.log.writeln('Copied ' 
                + tally.files.toString().cyan + ' files');
        }
    });

};
