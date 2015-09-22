var http = require('http')
var ecstatic = require('ecstatic')
var socketio = require('socket.io')
var socketHandler = require('./socket-server')
var path = require('path')

function makeServer() {
	var server = http.createServer(
		ecstatic({
			root: path.resolve(__dirname, '../static'),
			cache: 0,
			gzip: true
		})
	)

	var io = socketio(server)

	io.on('connection', socketHandler)

	return server
}

module.exports = makeServer
