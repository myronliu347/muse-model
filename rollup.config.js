import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import packageJson from './package.json';
export default {
  input: 'src/index.js',
  output: {
    banner: '/* muse-model myron.liu version ' + packageJson.version + ' */',
    file: 'dist/muse-model.js',
    format: 'umd',
    name: 'MuseModel'
  },
  plugins: [
    resolve({ jsnext: true, main: true, browser: true }),
    commonjs(),
    babel({
      babelrc: false,
      include: 'src/**',
      runtimeHelpers: true,
      presets: [
        [
          'env',
          {
            'modules': false
          }
        ],
        'stage-2'
      ]
    })
  ],
  external: ['vuex']
};
