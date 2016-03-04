const browserify = require('browserify')
const fs = require('fs')
const glob = require('glob')
const all = require('async-all')

const dev = process.argv[2] === 'dev'

function main(dev) {
	const b = buildBrowserifyPipeline(dev)
	function bundle() {
		buildGlobbed(() => {
			console.log('rebuilding', new Date())
			b.bundle().pipe(fs.createWriteStream('static/build.js'));
		})
	}

	b.on('update', bundle)

	bundle()
}
main(dev)

function buildBrowserifyPipeline(dev) {
	const b = browserify({
		entries: ['./client/index.js'],
		cache: {},
		packageCache: {},
		debug: dev
	}).transform('babelify', {
		presets: 'es2015',
		plugins: 'transform-object-rest-spread'
	}).transform('stringify')

	if (dev) {
		b.plugin('watchify', {
			ignoreWatch: [
				'**/globbed.js'
			]
		})
	}

	return b
}

function buildGlobbed(cb) {
	all({
		services: cb => globNonTest('services/*.js', cb),
		states: cb => globNonTest('states/**/*.js', cb)
	}, (err, globs) => {
		const servicesArray = getFilesAsRequireArray(globs.services)
		const statesArray = getFilesAsRequireArray(globs.states)

		const output = `
module.exports = {
	services: ${servicesArray},
	states: ${statesArray}
}`
		fs.writeFileSync('client/globbed.js', output + '\n')
		cb()
	})
}

function globNonTest(path, cb) {
	glob(path, {
		cwd: 'client'
	}, (err, files) => {
		if (err) {
			throw err
		}

		cb(err, files.filter(file => !/-test.js$/.test(file)).sort(sortGlobbedIncludes))
	})
}

function sortGlobbedIncludes(fileA, fileB) {
	var chunksA = fileA.split('/')
	var chunksB = fileB.split('/')
	return chunksA.length - chunksB.length
}

function getFilesAsRequireArray(files) {
	return '[\n' + files.map(file => {
		return `		require('./${file}')`
	}).join(',\n') + '\n\t]'
}
