import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const config = {
    input: 'src/index.ts',
    external: Object.keys( pkg.peerDependencies || {} ).concat( 'react-dom', 'react', 'rxjs', 'rxstore-observer' ),
    output: {
        file: "dist/react-rxstore-observer.js",
        format: 'umd',
        name: 'ReactRxStoreObserver',
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
    },
    plugins: [
        nodeResolve(),
        typescript( { declaration: false } ),
        babel( {
            exclude: '**/node_modules/**',
            babelHelpers: 'runtime',
        } ),
        replace( {
            'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
        } ),
        commonjs(),
    ],
}

if ( process.env.NODE_ENV === 'production' ) {
    config.plugins.push(
        terser( {
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false,
            },
        } )
    )
}

export default config