import alias from '@rollup/plugin-alias';
import run from '@rollup/plugin-run';
import del from 'rollup-plugin-delete';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import path from 'path';

const aliases = () => ({
    resolve: [".svelte", ".js", ".scss", ".css"],
    entries: [
        {
            find: /^@utils\/(.+)$/,
            replacement: path.resolve(
                process.cwd(),
                '..',
                'utils',
                '$1'
            )
        },
        {
            find: /^@policies\/(.+)$/,
            replacement: path.resolve(
                process.cwd(),
                'lib',
                'policies',
                '$1'
            )
        },
        {
            find: /^@lib\/(.+)$/,
            replacement: path.resolve(
                process.cwd(),
                'lib',
                '$1'
            )
        }
    ]
});

export default {
    input: './index.ts',
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
        replace({
            'process.env.DEV': process.env.NODE_ENV === 'development'
        }),
        typescript({}),
        alias(aliases()),
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