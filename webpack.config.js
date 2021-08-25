const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./index.js",
        alert: "./app/alert.js",
        breadcrumb: "./app/breadcrumb.js",
        datepicker: "./app/datepicker.js",
        form: "./app/form.js",
        nav: "./app/nav.js",
        navbar: "./app/navbar.js",
        pagination: "./app/pagination.js"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    mode: "development",
    module: {
        rules: [
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
                    from: "./node_modules/jquery/dist/jquery.min.js",
                    to: "vendor/jquery.min.js"
                },
                {
                    from: "./node_modules/@popperjs/core/dist/umd/popper.min.js",
                    to: "vendor/popper.min.js"
                }
            ],
        }),
        new webpack.SourceMapDevToolPlugin({
            append: '\n//# sourceMappingURL=http://localhost:8080/dist/[url]',
            filename: '[name].map',
        })
    ]
}
