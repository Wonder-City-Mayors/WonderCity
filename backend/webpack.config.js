const { resolve } = require("path")
const { spawn } = require("child_process")

const nodeExternals = require("webpack-node-externals")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const ESLintPlugin = require("eslint-webpack-plugin")

const entry = {
    master: resolve(process.cwd(), "master.ts"),
}

const output = {
    filename: "[name].js",
    path: resolve(process.cwd(), "dist"),
}

module.exports = (env, argv) => ({
    entry,
    output,

    target: "node",
    devtool: "eval-source-map",

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
                if (argv.mode === "development") {
                    let child

                    compiler.hooks.done.tap("DonePlugin", function () {
                        child = spawn("node", [output.path], {
                            env: process.env,
                        })

                        child.stdout.on("data", function (data) {
                            process.stdout.write(data)
                            child.stdin.write("what do you mean?")
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
                }
            },
        },
    ],

    externals: nodeExternals(),
})
