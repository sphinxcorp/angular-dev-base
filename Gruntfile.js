(function() {
    module.exports = function(grunt) {
        require('load-grunt-tasks')(grunt);
        require('time-grunt')(grunt);

        var ngAppDependencies = {
            'dev': {
                'ngAnimate': 'libs/angular-animate.min.js',
                'ngResource': 'libs/angular-resource.min.js',
                'ngMockE2E': 'libs/angular-mocks.js',
                'ngRoute': 'libs/angular-route.min.js'
            },
            prod : {
                'ngAnimate': 'libs/angular-animate.min.js',
                'ngResource': 'libs/angular-resource.min.js',
                'ngRoute': 'libs/angular-route.min.js'
            }
        };

        grunt.initConfig({
            bower: {
                install: {
                    options: {
                        copy: false
                    }
                },
                uninstall: {
                    options: {
                        cleanBowerDir: true,
                        copy: false,
                        install: false
                    }
                }
            },
            clean: {
                working: ['.temp/', 'dist/'],
                coffee: ['.temp/**/*.coffee', 'dist/**/*.coffee']
            },
            coffee: {
                app: {
                    files: [
                        {
                            cwd: '.temp/',
                            src: '**/*.coffee',
                            dest: '.temp/',
                            expand: true,
                            ext: '.js'
                        }
                    ],
                    options: {
                        sourceMap: true
                    }
                },
                jslove: {
                    files: [
                        {
                            cwd: '',
                            src: ['**/*.coffee', '!**/bower_components/**', '!**/node_modules/**'],
                            dest: '',
                            expand: true,
                            ext: '.js'
                        }
                    ]
                }
            },
            connect: {
                dev: {
                    options: {
                        base: 'dist/',
                        livereload: true,
                        middleware: require('./backend/middleware'),
                        onCreateServer: require('./backend/socketServer'),
                        sockjsOptions: {
                            sockjs_url: "/libs/sockjs.min.js",
                            prefix: '/livefeed'
                        },
                        open: true,
                        port: 3333                        
                    }
                },
                prod: {
                    options: {
                        base: 'dist/',
                        livereload: false,
                        middleware: require('./backend/middleware'),
                        onCreateServer: require('./backend/socketServer'),
                        sockjsOptions: {
                            sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js",
                            prefix: '/livefeed'
                        },
                        open: true,
                        port: 3333                        
                    }
                }
            },
            copy: {
                app: {
                    files: [
                        {
                            cwd: 'frontend/',
                            src: '**',
                            dest: '.temp/',
                            expand: true
                        }, {
                            cwd: 'bower_components/angular/',
                            src: 'angular.*',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/angular-animate/',
                            src: 'angular-animate.*',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/angular-mocks/',
                            src: 'angular-mocks.*',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/angular-route/',
                            src: 'angular-route.*',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/angular-resource/',
                            src: 'angular-resource.*',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/html5shiv/dist/',
                            src: 'html5shiv-printshiv.js',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/json3/lib/',
                            src: 'json3.min.js',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/requirejs/',
                            src: 'require.js',
                            dest: '.temp/libs/',
                            expand: true
                        }, {
                            cwd: 'bower_components/sockjs/',
                            src: 'sockjs.*',
                            dest: '.temp/libs/',
                            expand: true
                        }
                    ]
                },
                dev: {
                    cwd: '.temp/',
                    src: '**',
                    dest: 'dist/',
                    expand: true
                },
                prod: {
                    files: [
                        {
                            cwd: '.temp/assets/',
                            src: '**/*',
                            dest: 'dist/assets/',
                            expand: true
                        }, {
                            cwd: '.temp/',
                            src: ['**/ie.min.*.js', '**/scripts.min.*.js'],
                            dest: 'dist/',
                            expand: true
                        }, {
                            cwd: '.temp/',
                            src: '**/index.html',
                            dest: 'dist/',
                            expand: true
                        }
                    ]
                }
            },
            hash: {
                images: '.temp/**/*.{gif,jpeg,jpg,png,svg,webp}',
                scripts: ['.temp/phone/scripts/scripts.min.js', '.temp/tablet/scripts/scripts.min.js', '.temp/desktop/scripts/ie.min.js', '.temp/desktop/scripts/scripts.min.js'],
                styles: '.temp/assets/css/**/*.css'
            },
            imagemin: {
                images: {
                    files: [
                        {
                            cwd: '.temp/',
                            src: '**/*.{gif,jpeg,jpg,png}',
                            dest: '.temp/',
                            expand: true
                        }
                    ],
                    options: {
                        optimizationLevel: 7
                    }
                }
            },
            ngTemplateCache: {
                views: {
                    files: {
                        '.temp/phone/scripts/views.js': '.temp/phone/views/**/*.html',
                        '.temp/tablet/scripts/views.js': '.temp/tablet/views/**/*.html',
                        '.temp/desktop/scripts/views.js': '.temp/desktop/views/**/*.html'
                    },
                    options: {
                        trim: '.temp'
                    }
                }
            },
            requirejs: {
                phone: {
                    options: {
                        baseUrl: '.temp/',
                        findNestedDependencies: true,
                        logLevel: 0,
                        mainConfigFile: '.temp/phone/scripts/main.js',
                        name: 'phone/scripts/main',
                        onBuildWrite: function(moduleName, path, contents) {
                            var modulesToExclude, shouldExcludeModule;
                            modulesToExclude = ['phone/scripts/main'];
                            shouldExcludeModule = modulesToExclude.indexOf(moduleName) >= 0;
                            if (shouldExcludeModule) {
                                return '';
                            }
                            return contents;
                        },
                        optimize: 'uglify2',
                        out: '.temp/phone/scripts/scripts.min.js',
                        preserveLicenseComments: false,
                        skipModuleInsertion: true,
                        uglify: {
                            no_mangle: false
                        },
                        useStrict: true,
                        wrap: {
                            start: '(function(){\'use strict\';',
                            end: '}).call(this);'
                        }
                    }
                },
                tablet: {
                    options: {
                        baseUrl: '.temp/',
                        findNestedDependencies: true,
                        logLevel: 0,
                        mainConfigFile: '.temp/tablet/scripts/main.js',
                        name: 'tablet/scripts/main',
                        onBuildWrite: function(moduleName, path, contents) {
                            var modulesToExclude, shouldExcludeModule;
                            modulesToExclude = ['tablet/scripts/main'];
                            shouldExcludeModule = modulesToExclude.indexOf(moduleName) >= 0;
                            if (shouldExcludeModule) {
                                return '';
                            }
                            return contents;
                        },
                        optimize: 'uglify2',
                        out: '.temp/tablet/scripts/scripts.min.js',
                        preserveLicenseComments: false,
                        skipModuleInsertion: true,
                        uglify: {
                            no_mangle: false
                        },
                        useStrict: true,
                        wrap: {
                            start: '(function(){\'use strict\';',
                            end: '}).call(this);'
                        }
                    }
                },
                desktop: {
                    options: {
                        baseUrl: '.temp/',
                        findNestedDependencies: true,
                        logLevel: 0,
                        mainConfigFile: '.temp/desktop/scripts/main.js',
                        name: 'desktop/scripts/main',
                        onBuildWrite: function(moduleName, path, contents) {
                            var modulesToExclude, shouldExcludeModule;
                            modulesToExclude = ['desktop/scripts/main'];
                            shouldExcludeModule = modulesToExclude.indexOf(moduleName) >= 0;
                            if (shouldExcludeModule) {
                                return '';
                            }
                            return contents;
                        },
                        optimize: 'uglify2',
                        out: '.temp/desktop/scripts/scripts.min.js',
                        preserveLicenseComments: false,
                        skipModuleInsertion: true,
                        uglify: {
                            no_mangle: false
                        },
                        useStrict: true,
                        wrap: {
                            start: '(function(){\'use strict\';',
                            end: '}).call(this);'
                        }
                    }
                }
            },
            shimmer: {
                phoneDev: {
                    cwd: '.temp/',
                    requireConfig: {
                        baseUrl: '/',
                        paths: {
                            'app': 'phone/scripts/app',
                            'bootstrap': 'phone/scripts/bootstrap'
                        }
                    },
                    src: [ 'common/scripts/**/*.js', 'phone/scripts/**/*.js', 'libs/**/*.js', '!libs/sockjs.{coffee,js}', '!libs/angular.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-resource.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}'],
                    order: [
                        'libs/angular.min.js', {
                            'NGAPP': ngAppDependencies.dev
                        }
                    ],
                    dest: 'phone/scripts/',
                    require: 'NGBOOTSTRAP'
                },
                phoneProd: {
                    cwd: '<%= shimmer.phoneDev.cwd %>',
                    requireConfig: {
                        baseUrl: '/',
                        paths: {
                            'app': 'phone/scripts/app',
                            'bootstrap': 'phone/scripts/bootstrap'
                        }
                    },
                    src: [ 'common/scripts/**/*.js', 'phone/scripts/**/*.js', 'libs/**/*.js', '!libs/sockjs.*', '!libs/angular.{coffee,js}', '!libs/angular-mocks.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-resource.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}', '!common/scripts/backend/**/*.*', '!phone/scripts/backend/**/*.*'],
                    order: [
                        'libs/angular.min.js', {
                            'NGAPP': ngAppDependencies.prod
                        }
                    ],
                    dest: '<%= shimmer.phoneDev.dest %>',
                    require: '<%= shimmer.phoneDev.require %>'
                },
                tabletDev: {
                    cwd: '.temp/',
                    requireConfig: {
                        baseUrl: '/',
                        paths: {
                            'app': 'tablet/scripts/app',
                            'bootstrap': 'tablet/scripts/bootstrap'
                        }
                    },
                    src: [ 'common/scripts/**/*.js', 'tablet/scripts/**/*.js', 'libs/**/*.js', '!libs/sockjs.{coffee,js}', '!libs/angular.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-resource.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}'],
                    order: [
                        'libs/sockjs.min.js',
                        'libs/angular.min.js', {
                            'NGAPP': ngAppDependencies.dev
                        }
                    ],
                    dest: 'tablet/scripts/',
                    require: 'NGBOOTSTRAP'
                },
                tabletProd: {
                    cwd: '<%= shimmer.tabletDev.cwd %>',
                    requireConfig: {
                        baseUrl: '/',
                        paths: {
                            'app': 'tablet/scripts/app',
                            'bootstrap': 'tablet/scripts/bootstrap'
                        }
                    },
                    src: [ 'common/scripts/**/*.js', 'tablet/scripts/**/*.js', 'libs/**/*.js', '!libs/sockjs.*', '!libs/angular.{coffee,js}', '!libs/angular-mocks.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-resource.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}', '!common/scripts/backend/**/*.*', '!tablet/scripts/backend/**/*.*'],
                    order: [
                        'libs/angular.min.js', {
                            'NGAPP': ngAppDependencies.prod
                        }
                    ],
                    dest: '<%= shimmer.tabletDev.dest %>',
                    require: '<%= shimmer.tabletDev.require %>'
                },
                desktopDev: {
                    cwd: '.temp/',
                    requireConfig: {
                        baseUrl: '/',
                        paths: {
                            'app': 'desktop/scripts/app',
                            'bootstrap': 'desktop/scripts/bootstrap'
                        }
                    },
                    src: [ 'common/scripts/**/*.js', 'desktop/scripts/**/*.js', 'libs/**/*.js', '!libs/sockjs.{coffee,js}', '!libs/angular.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-resource.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}'],
                    order: [
                        'libs/sockjs.min.js',
                        'libs/angular.min.js', {
                            'NGAPP': ngAppDependencies.dev
                        }
                    ],
                    dest: 'desktop/scripts/',
                    require: 'NGBOOTSTRAP'
                },
                desktopProd: {
                    cwd: '<%= shimmer.desktopDev.cwd %>',
                    requireConfig: {
                        baseUrl: '/',
                        paths: {
                            'app': 'desktop/scripts/app',
                            'bootstrap': 'desktop/scripts/bootstrap'
                        }
                    },
                    src: [ 'common/scripts/**/*.js', 'desktop/scripts/**/*.js', 'libs/**/*.js', '!libs/sockjs.*', '!libs/angular.{coffee,js}', '!libs/angular-mocks.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-resource.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}', '!common/scripts/backend/**/*.*', '!desktop/scripts/backend/**/*.*'],
                    order: [
                        'libs/angular.min.js', {
                            'NGAPP': ngAppDependencies.prod
                        }
                    ],
                    dest: '<%= shimmer.desktopDev.dest %>',
                    require: '<%= shimmer.desktopDev.require %>'
                }
            },
            template: {
                indexDev: {
                    files: {
                        '.temp/phone/index.html': '.temp/phone/index.html',
                        '.temp/tablet/index.html': '.temp/tablet/index.html',
                        '.temp/desktop/index.html': '.temp/desktop/index.html'
                    }
                },
                index: {
                    files: {
                        '.temp/phone/index.html': '.temp/phone/index.html',
                        '.temp/tablet/index.html': '.temp/tablet/index.html',
                        '.temp/desktop/index.html': '.temp/desktop/index.html'
                    },
                    environment: 'prod'
                }
            },
            uglify: {
                scripts: {
                    files: {
                        '.temp/desktop/scripts/ie.min.js': ['.temp/libs/json3.js', '.temp/libs/html5shiv-printshiv.js']
                    }
                }
            },
            watch: {
                basic: {
                    files: ['frontend/assets/**', 'frontend/**/*.js', 'frontend/**/*.css', 'frontend/**/*.html'],
                    tasks: ['copy:app', 'copy:dev'],
                    options: {
                        livereload: true,
                        nospawn: true
                    }
                },
                coffee: {
                    files: 'frontend/**/*.{coffee,js}',
                    tasks: ['clean:working', 'copy:app', 'shimmer:phoneDev', 'shimmer:tabletDev', 'shimmer:desktopDev', 'coffee:app', 'copy:dev'],
                    options: {
                        livereload: true,
                        nospawn: true
                    }
                },
                spaHtml: {
                    files: 'frontend/**/index.html',
                    tasks: ['copy:app', 'template:indexDev', 'copy:dev'],
                    options: {
                        livereload: true,
                        nospawn: true
                    }
                },
                none: {
                    files: 'none',
                    options: {
                        livereload: false
                    }
                }
            }
        });

        grunt.event.on('watch', function(action, filepath, key) {
            var basename, coffeeConfig, copyDevConfig, dirname, ext, file, path;
            var srcPath = 'frontend/';
            path = require('path');
            file = filepath.substr(srcPath.length);
            console.log('processing file ' + file);
            dirname = path.dirname(file);
            ext = path.extname(file);
            basename = path.basename(file, ext);
            grunt.config(['copy', 'app'], {
                cwd: srcPath,
                src: file,
                dest: '.temp/',
                expand: true
            });
            copyDevConfig = grunt.config(['copy', 'dev']);
            copyDevConfig.src = file;
            if (key === 'coffee') {
                grunt.config(['clean', 'working'], [path.join('.temp', dirname, "" + basename + ".{coffee,js,js.map}")]);
                copyDevConfig.src = [path.join(dirname, "" + basename + ".{coffee,js,js.map}"), 'scripts/main.{coffee,js,js.map}'];
                coffeeConfig = grunt.config(['coffee', 'app', 'files']);
                coffeeConfig.src = file;
                grunt.config(['coffee', 'app', 'files'], coffeeConfig);
            }
            return grunt.config(['copy', 'dev'], copyDevConfig);
        });

        grunt.registerTask('build', ['clean:working', 'copy:app', 'shimmer:phoneDev', 'shimmer:tabletDev', 'shimmer:desktopDev', 'coffee:app', 'template:indexDev', 'copy:dev', 'clean:coffee']);
        grunt.registerTask('dev', ['build', 'connect:dev', 'watch']);
        grunt.registerTask('prod', ['clean:working', 'copy:app', 'ngTemplateCache', 'shimmer:phoneProd', 'shimmer:tabletProd', 'shimmer:desktopProd', 'coffee:app', 'imagemin', 'hash:images', 'requirejs', 'uglify', 'hash:scripts', 'hash:styles', 'template:index', 'copy:prod', 'clean:coffee']);
        grunt.registerTask('server', ['connect:prod', 'watch:none']);
        return grunt.registerTask('default', ['dev']);
    };

}).call(this);
