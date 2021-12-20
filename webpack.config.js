const path = require("path");
const webpack = require("webpack");
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
// SEE: https://webpack.js.org/plugins/copy-webpack-plugin/
const CopyPlugin = require("copy-webpack-plugin");

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

module.exports = {
    entry: {
        index: "./index.js",
        alert: "./app/alert.js",
        breadcrumb: "./app/breadcrumb.js",
        datepicker: "./app/datepicker.js",
        filterbox: "./app/filterbox.js",
        form: "./app/form.js",
        global: "./app/global.js",
        input: "./app/input.js",
        nav: "./app/nav.js",
        navbar: "./app/navbar.js",
        pagination: "./app/pagination.js",
        picklist: "./app/picklist.js"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    mode: "development",
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        [require.resolve("@babel/preset-env")],
                        [
                            require.resolve("@babel/preset-react"),
                            {
                                runtime: hasJsxRuntime ? "automatic" :
                                    "classic",
                            },
                        ],
                    ],
                }
            },
            {
                test: /\.stache$/,
                use: {
                    loader: "can-stache-loader"
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./node_modules/bootstrap/dist/js/bootstrap.min.js",
                    to: "vendor/bootstrap.min.js"
                },
                {
                    from: "./node_modules/bootstrap/dist/js/bootstrap.min.js.map",
                    to: "vendor/bootstrap.min.js.map"
                },
                {
                    from: "./node_modules/bootstrap/dist/css/bootstrap.min.css",
                    to: "vendor/css/bootstrap.min.css"
                },
                {
                    from: "./node_modules/bootstrap/dist/css/bootstrap.min.css.map",
                    to: "vendor/css/bootstrap.min.css.map"
                },
                {
                    from: "./node_modules/jquery/dist/jquery.min.js",
                    to: "vendor/jquery.min.js"
                },
                {
                    from: "./node_modules/@popperjs/core/dist/umd/popper.min.js",
                    to: "vendor/popper.min.js"
                },
                {
                    from: "./node_modules/@popperjs/core/dist/umd/popper.min.js.map",
                    to: "vendor/popper.min.js.map"
                },
                {
                    from: "./node_modules/codemirror/lib/codemirror.js",
                    to: "vendor/codemirror.js"
                },
                {
                    from: "./node_modules/codemirror/mode/xml/xml.js",
                    to: "vendor/codemirror_mode_xml.js"
                },
                {
                    from: "./node_modules/codemirror/lib/codemirror.css",
                    to: "vendor/css/codemirror.css"
                }
            ],
        }),
        new webpack.SourceMapDevToolPlugin({
            append: '\n//# sourceMappingURL=[url]',
            filename: '[name].bundle.map',
        })
    ]
}

// Also see:
// Implemented at package.json watch task
// - https://webpack.js.org/guides/development/#using-watch-mode
// Consider:
// -  https://webpack.js.org/guides/tree-shaking/
