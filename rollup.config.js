import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { dts } from 'rollup-plugin-dts';

const config = [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'dist/index.es.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-react']
      }),
      commonjs(),
      postcss({
        extract: true,
        minimize: true
      })
    ],
    external: ['react', 'react-dom']
  },
  {
    input: 'src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  }
];

export default config;