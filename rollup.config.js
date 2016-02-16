import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'
import string from 'rollup-plugin-string'

export default {
	plugins: [
		string({
			extensions: [ '.html' ]
		}),
		includePaths({
			paths: [ 'client/common' ]
		}),
		nodeResolve({
			jsnext: true,
			main: true,
			browser: true,
			builtins: true
		}),
		commonjs({
			include: 'node_modules/**',
			exclude: [ ]
		}),
		babel()
	]
}
