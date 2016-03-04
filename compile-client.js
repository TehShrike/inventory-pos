const browserify = require('browserify')
const fs = require('fs')
const glob = require('glob')
const all = require('async-all')
const each = require('async-each')
const chokidar = require('chokidar')

const postcss = require('postcss')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

const dev = process.argv[2] === 'dev'

const cssProcessor = postcss([
	autoprefixer,
	precss
])

function main(dev) {
	const b = buildBrowserifyPipeline(dev)
	function bundle() {
		buildGlobbed(() => {
			console.log('rebuilding', new Date())
			b.bundle().pipe(fs.createWriteStream('static/build.js'));
		})
	}

	b.on('update', bundle)

	// bundle()

	buildCss(bundle)
	if (dev) {
		watchCss(buildCss)
	}
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

		cb(err, files.filter(file => !/-test.js$/.test(file)).sort(sortByDepth))
	})
}

function sortByDepth(fileA, fileB) {
	var chunksA = fileA.split('/')
	var chunksB = fileB.split('/')
	return chunksA.length - chunksB.length
}

function getFilesAsRequireArray(files) {
	return '[\n' + files.map(file => {
		return `		require('./${file}')`
	}).join(',\n') + '\n\t]'
}

function buildCss(done) {
	glob('client/**/*.css', (err, files) => {
		if (err) {
			throw err
		}
		const filesInLoadOrder = files.sort(sortByDepth)

		each(filesInLoadOrder, fs.readFile, (err, contents) => {
			const lazyResults = contents.map((css, index) => {
				const file = files[index]

				return cssProcessor.process(css, {
					from: file,
					to: 'bundle.css'
				})
			})

			Promise.all(lazyResults).then(results => {
				const rootOfAll = results.map(result => result.root).reduce((memo, nextRoot) => memo.append(nextRoot))

				const filename = 'bundle.css'

				const result = rootOfAll.toResult({
					to: filename,
					map: {
						inline: false
					}
				})

				const css = result.css.toString()
				fs.writeFileSync('./static/css/' + filename, css)
				fs.writeFileSync('./static/css/' + filename + '.map', result.map.toString())

				done && done(filename)
			}, rejection => {
				console.error(rejection)
				throw rejection
			})
		})
	})
}

function watchCss(cb) {
	const watcher = chokidar.watch('./client/**/*.css', {
		ignoreInitial: true
	})

	watcher.on('add', cb)
	watcher.on('change', cb)
	watcher.on('unlink', cb)
}