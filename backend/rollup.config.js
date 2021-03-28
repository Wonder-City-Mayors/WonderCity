import run from "@rollup/plugin-run";
import del from "rollup-plugin-delete";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import { nodeResolve } from "@rollup/plugin-node-resolve";

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
        del({
            targets: "dist",
            runOnce: true,
        }),
        replace({
            "process.env.DEV": process.env.NODE_ENV === "development",
        }),
        typescript({}),
        nodeResolve(),
        commonjs({
            include: /node_modules/,
        }),
        json(),
        run(),
    ],
    external: ["knex"],
};
