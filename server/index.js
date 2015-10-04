var http = require('http')
var ecstatic = require('ecstatic')
var socketio = require('socket.io')
var socketHandler = require('./socket-server')
var path = require('path')
var mysql = require('mysql')

var mysql = require('mysql')

var pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'pos'
})

function makeServer() {
	var server = http.createServer(
		ecstatic({
			root: path.resolve(__dirname, '../static'),
			cache: 0,
			gzip: true
		})
	)

	var io = socketio(server)

	io.on('connection', socketHandler.bind(null, pool))

	return server
}

module.exports = makeServer
