import run from '@rollup/plugin-run';
import del from 'rollup-plugin-delete';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: './index.js',
    output: {
        file: './dist/bundle.js',
        format: 'cjs'
    },
    watch: {
        exclude: ['./node_modules', './api']
    },
    plugins: [
        del({
            targets: 'dist',
            runOnce: true
        }),
        nodeResolve(),
        commonjs({
            include: /node_modules/,
        }),
        json(),
        run(),
    ],
    external: [
        'knex',
    ]
};