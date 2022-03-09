const path = require("path");
const webpack = require("webpack");

// This is related to the new jsx transform
// SEE: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
// Yanked from the create react app. O.o
const hasJsxRuntime = (() => {
    if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
        return false;
    }
    try {
        require.resolve("react/jsx-runtime");
        return true;
    } catch (e) {
        return false;
    }
})();

const defaultWebpackOptions = {
    mode: 'development',
    output: {
        filename: '[name]-test.js',
        path: path.resolve(__dirname, "test/dist")
    },
    stats: {
        modules: false,
        colors: true,
    },
    watch: false,
    module: {
        rules: [
            {
                test: /\.stache$/,
                use: {
                    loader: "can-stache-loader"
                }
            },
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                require.resolve("@babel/preset-env")
                            ],
                            [
                                require.resolve("@babel/preset-react"),
                                {
                                    runtime: hasJsxRuntime ? "automatic" :
                                        "classic",
                                }
                            ],
                        ],
                        // SEE: https://newbedev.com/babel-7-referenceerror-regeneratorruntime-is-not-defined
                        plugins: [
                            require.resolve("@babel/plugin-transform-runtime")
                        ],
                    }
                }
            }
        ]
    },
    // optimization: {
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //         chunks: 'all',
    //         minSize: 0,
    //         cacheGroups: {
    //             commons: {
    //                 name: 'commons',
    //                 chunks: 'initial',
    //                 minChunks: 1,
    //             },
    //         },
    //     },
    // },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            append: '\n//# sourceMappingURL=[url]',
            filename: '[name].bundle.map',
        })
    ],
};

module.exports = (config) => {
    config.set({
        // ... normal karma configuration
        browsers: ['Electron'],
        client: {
            captureConsole: true,
            useIframe: false,
            clearContext: false,
            qunit: {
                showUI: true,
                testTimeout: 500
            }

        },
        // make sure to include webpack as a framework
        frameworks: ['webpack', "qunit"],
        reporters: ['dots'],
        //browserNoActivityTimeout: 15000,
        customLaunchers: {
            CustomElectron: {
                base: 'Electron',
                browserWindowOptions: {
                    show: true,
                    // DEV: More preferentially, should link your own `webPreferences` from your Electron app instead
                    webPreferences: {
                        // Preferred `preload` mechanism to expose `require`


                        // Alternative non-preload mechanism to expose `require`
                        // nodeIntegration: true,
                        // contextIsolation: false



                        // nativeWindowOpen is set to `true` by default by `karma-electron` as well, see #50
                        nativeWindowOpen: false
                    }
                }
            }
        },
        plugins: [
            'karma-qunit',
            'karma-electron',
            'karma-webpack'

        ],

        files: [
            "./node_modules/jquery/dist/jquery.min.js",
            // all files ending in ".test.js"
            // !!! use watched: false as we use webpacks watch
            { pattern: './test/**/*-test.js', watched: false },
            { pattern: "./test/dist/*-test.*.js", watched: false }
        ],

        preprocessors: {
            // add webpack as preprocessor
            './test/**/*-test.js': ["webpack"]
        },

        webpack: defaultWebpackOptions,
    });
}
