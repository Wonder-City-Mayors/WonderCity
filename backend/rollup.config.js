import run from "@rollup/plugin-run";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";

import { resolve } from "path";

export default {
    input: "./index.ts",
    output: {
        file: "./dist/bundle.js",
        format: "cjs",
    },
    watch: {
        exclude: ["./node_modules", "./api"],
    },
    plugins: [
        replace({
            "process.env.DEV": process.env.NODE_ENV === "development",
        }),
        alias([
            {
                find: "@objection",
                replace: resolve(process.cwd(), "lib", "database", "objection"),
            },
        ]),
        typescript({}),
        // nodeResolve(),
        // commonjs({
        //     include: /node_modules/,
        //     extensions: [".ts", ".js"],
        // }),
        // json(),
        // run(),
    ],
    external: ["knex"],
};
