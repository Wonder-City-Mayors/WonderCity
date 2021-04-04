const { resolve, join } = require("path")
const { spawn } = require("child_process")

const nodeExternals = require("webpack-node-externals")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const ESLintPlugin = require("eslint-webpack-plugin")

const output = {
    path: resolve(process.cwd(), "dist"),
    filename: "bundle.js",
}

module.exports = {
    mode: "development",

    entry: resolve(process.cwd(), "index.ts"),
    output,

    devtool: false,

    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: [resolve(process.cwd(), "node_modules")],
            },
        ],
    },

    resolve: {
        alias: {},
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        plugins: [new TsconfigPathsPlugin({})],
    },

    plugins: [
        new ESLintPlugin(),
        {
            apply(compiler) {
                let child

                compiler.hooks.done.tap("DonePlugin", function () {
                    child = spawn(
                        "node",
                        [join(output.path, output.filename)],
                        {
                            env: process.env,
                        },
                    )

                    child.stdout.on("data", function (data) {
                        process.stdout.write(data)
                    })

                    child.stderr.on("data", function (data) {
                        process.stderr.write(data)
                    })
                })

                compiler.hooks.watchRun.tap("WatchRunPlugin", function () {
                    if (child) {
                        console.log("Rebuilding...")

                        child.kill("SIGINT")
                    }
                })
            },
        },
    ],

    externals: [nodeExternals()],
}
