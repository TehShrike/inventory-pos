require('loud-rejection/register')
require('babel-register')({
	presets: 'es2015',
	plugins: 'transform-object-rest-spread',
	ignore: function(path) {
		// false => transpile with babel
		const nodeModules = /\/node_modules\//.test(path)
		if (nodeModules) {
			return !/\/server\/node_modules\//.test(path)
		}
		return false
	}
})

const http = require('http')
const ecstatic = require('ecstatic')
const socketio = require('socket.io')
const path = require('path')
const mannish = require('mannish')
const parseUrl = require('url').parse
const db = require('db')

const socketHandler = require('./socket-server')

const config = {
	imageDirectories: {
		customerDriversLicense: '/tmp/customer-drivers-license',
		customerPrescription: '/tmp/customer-prescription'
	},
	mediator: mannish()
}

const staticDirectories = [
	{ path: '/driverslicense', directory: config.imageDirectories.customerDriversLicense },
	{ path: '/prescription', directory: config.imageDirectories.customerPrescription }
].map(function(directory) {
	directory.server = ecstatic({
		root: path.resolve(directory.directory),
		baseDir: directory.path,
		gzip: true,
		cache: 'private, max-age=0, no-cache, no-store'
	})
	return directory
})

function makeServer() {
	const websiteServer = ecstatic({
		root: path.resolve(__dirname, '../static'),
		cache: 0,
		gzip: true
	})

	const server = http.createServer(function(request, response) {
		const pathName = parseUrl(request.url).pathname
		const server = staticDirectories.reduce(function(defaultServer, directory) {
			if (pathName.indexOf(directory.path) === 0) {
				return directory.server
			} else {
				return defaultServer
			}
		}, websiteServer)

		server(request, response)
	})

	const io = socketio(server)

	io.on('connection', function(socket) {
		// TODO: real authentication
		socket.on('authenticate', function(userId, cb) {
			db.user.load(userId, (err, user) => {
				if (err) {
					cb(err)
				} else {
					db.account.load(user.accountId, (err, account) => {
						if (err) {
							cb(err)
						} else {
							socketHandler({
								userId: user.userId,
								accountId: user.accountId,
								tagScope: account.defaultTagScope,
								config: config
							}, socket)


							cb(null, {
								userId: userId,
								name: 'Totally cool user'
							})
						}
					})
				}
			})
		})
	})

	return server
}

module.exports = makeServer
