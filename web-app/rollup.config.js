import alias from "@rollup/plugin-alias"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import commonjs from "@rollup/plugin-commonjs"
import svelte from "rollup-plugin-svelte"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import config from "sapper/config/rollup.js"
import pkg from "./package.json"
import postcss from "rollup-plugin-postcss"
import typescript from "@rollup/plugin-typescript"

import path from "path"

const mode = process.env.NODE_ENV
const dev = mode === "development"
const legacy = !!process.env.SAPPER_LEGACY_BUILD
const { preprocess } = require("./svelte.config")

const onwarn = (warning, onwarn) =>
    (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
    (warning.code === "CIRCULAR_DEPENDENCY" &&
        /[/\\]@sapper[/\\]/.test(warning.message)) ||
    onwarn(warning)

const aliases = () => ({
    resolve: [".svelte", ".js", ".scss", ".css"],
    entries: [
        {
            find: /^utils\/(.+)$/,
            replacement: path.resolve(process.cwd(), "..", "utils", "$1"),
        },
        {
            find: /^components\/(.+)$/,
            replacement: path.resolve(process.cwd(), "src", "components", "$1"),
        },
    ],
})

const external = Object.keys(pkg.dependencies).concat(
    require("module").builtinModules,
)

const watch = {
    exclude: ["./node_modules/**/*"],
    chokidar: {
        usePolling: true,
    },
}

const postcssConfig = () => ({
    extensions: [".scss", ".sass"],
    extract: false,
    minimize: true,
    use: [
        [
            "sass",
            {
                includePaths: [
                    "./src/theme",
                    "./node_modules",
                    // This is only needed because we're using a local module. :-/
                    // Normally, you would not need this line.
                    path.resolve(__dirname, "..", "node_modules"),
                ],
            },
        ],
    ],
})

export default {
    client: {
        input: config.client.input().replace(/\.js$/i, ".ts"),
        output: config.client.output(),
        watch,
        plugins: [
            alias(aliases()),
            replace({
                preventAssignment: true,
                values: {
                    "process.browser": true,
                    "process.env.NODE_ENV": JSON.stringify(mode),
                },
            }),
            svelte({
                dev,
                hydratable: true,
                emitCss: false,
                css: true,
                preprocess,
                onwarn: (warning, handler) => {
                    if (warning.code === "a11y-label-has-associated-control")
                        return
                    handler(warning)
                },
            }),
            resolve({
                browser: true,
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript({}),
            postcss(postcssConfig()),

            legacy &&
                babel({
                    extensions: [".js", ".mjs", ".html", ".svelte"],
                    babelHelpers: "runtime",
                    exclude: ["node_modules/@babel/**"],
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: "> 0.25%, not dead",
                            },
                        ],
                    ],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                useESModules: true,
                            },
                        ],
                    ],
                }),

            !dev &&
                terser({
                    module: true,
                }),
        ],
        external,
        preserveEntrySignatures: false,
        onwarn,
    },

    server: {
        input: config.server.input().server.replace(/\.js$/i, ".ts"),
        output: config.server.output(),
        watch,
        plugins: [
            alias(aliases()),
            replace({
                preventAssignment: true,
                values: {
                    "process.browser": false,
                    "process.env.NODE_ENV": JSON.stringify(mode),
                },
            }),
            svelte({
                generate: "ssr",
                hydratable: true,
                emitCss: false,
                css: true,
                dev,
                preprocess,
                onwarn: (warning, handler) => {
                    if (warning.code === "a11y-label-has-associated-control")
                        return
                    handler(warning)
                },
            }),
            resolve({
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript({}),
            postcss(postcssConfig()),
        ],
        external,
        preserveEntrySignatures: "strict",
        onwarn,
    },

    serviceworker: {
        input: config.serviceworker.input().replace(/\.js$/i, ".ts"),
        output: config.serviceworker.output(),
        watch,
        plugins: [
            resolve(),
            replace({
                preventAssignment: true,
                values: {
                    "process.browser": true,
                    "process.env.NODE_ENV": JSON.stringify(mode),
                },
            }),
            commonjs(),
            !dev && terser(),
        ],
        external,
        preserveEntrySignatures: false,
        onwarn,
    },
}
