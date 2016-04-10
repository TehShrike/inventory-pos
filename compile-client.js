const browserify = require('browserify')
const fs = require('fs')
const glob = require('glob')
const all = require('async-all')
const each = require('async-each')
const chokidar = require('chokidar')
const tinylr = require('tiny-lr')
const camelize = require('camelize')

const postcss = require('postcss')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

const dev = process.argv[2] === 'dev'

const cssProcessor = postcss([
	autoprefixer,
	precss
])

if (dev) {
	const tinyReloadServer = tinylr()

	tinyReloadServer.listen(35729)

	function emitChangedFile(file) {
		console.log('emitting reload', file)
		tinyReloadServer.changed({
			body: {
				files: [file]
			}
		})
	}
}

function main(dev) {
	const b = buildBrowserifyPipeline(dev)
	function bundle() {
		buildGlobbed(() => {
			console.log('rebuilding', new Date())
			const writeToDiskStream = fs.createWriteStream('static/build.js')
			b.bundle().pipe(writeToDiskStream)
			if (dev) {
				writeToDiskStream.on('finish', () => {
					emitChangedFile('static/build.js')
				})
			}
		})
	}

	if (dev) {
		b.on('update', bundle)
	}


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
		}).plugin('errorify')
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
		// const sharedObject = getFilesAsRequireObject(globs.shared)

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

// function getFilesAsRequireObject(files) {
// 	return '{\n' + files.map(file => {
// 		const key = camelize(file.substring('../shared/'.length, file.length - '.js'.length))
// 		return `		${key}: require('./${file}')`
// 	}).join(',\n') + '\n\t}'
// }

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
				const outputFilename = './static/css/' + filename
				fs.writeFileSync(outputFilename, css)
				fs.writeFileSync(outputFilename + '.map', result.map.toString())

				if (dev) {
					emitChangedFile(outputFilename)
				}

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