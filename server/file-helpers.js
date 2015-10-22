var joinPath = require('path').join
var fs = require('fs')
var saveStream = require('./save-stream-to-file')

module.exports = {
	checkFileExists: checkFileExists,
	getFileStreamHandler: getFileStreamHandler
}

function checkFileExists(directory, id, cb) {
	var filePath = getPath(directory, id)

	fs.stat(filePath, function(err, stats) {
		if (err) {
			cb(null, false)
		} else {
			cb(null, stats.isFile())
		}
	})
}

function getFileStreamHandler(directory, idKey) {
	return function(stream, data, cb) {
		var filePath = getPath(directory, data[idKey])
		saveStream({ stream: stream, filePath: filePath }, cb)
	}
}

function getPath(directory, id) {
	id = parseInt(id, 10).toString(10)
	return joinPath(directory, id)
}
