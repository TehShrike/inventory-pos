var http = require('http')
var ecstatic = require('ecstatic')
var socketio = require('socket.io')
var path = require('path')
var mannish = require('mannish')
var parseUrl = require('url').parse
var extend = require('xtend')

var socketHandler = require('./socket-server')

var config = {
	imageDirectories: {
		customerDriversLicense: '/tmp/customer-drivers-license',
		customerPrescription: '/tmp/customer-prescription'
	},
	mediator: mannish()
}

var staticDirectories = [
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
	var websiteServer = ecstatic({
		root: path.resolve(__dirname, '../static'),
		cache: 0,
		gzip: true
	})

	var server = http.createServer(function(request, response) {
		var pathName = parseUrl(request.url).pathname
		var server = staticDirectories.reduce(function(defaultServer, directory) {
			if (pathName.indexOf(directory.path) === 0) {
				return directory.server
			} else {
				return defaultServer
			}
		}, websiteServer)

		server(request, response)
	})

	var io = socketio(server)

	io.on('connection', function(socket) {
		// TODO: real authentication
		socket.on('authenticate', function(userId, cb) {
			socketHandler({
				userId: userId,
				config: config
			}, socket)


			cb(null, {
				userId: userId,
				name: 'Totally cool user'
			})
		})
	})

	return server
}

module.exports = makeServer
