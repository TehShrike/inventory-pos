var fs = require('fs')
var dezalgo = require('dezalgo')

module.exports = function writeStreamToFile(options, cb) {
	cb = dezalgo(cb)
	var stream = options.stream
	var filePath = options.filePath

	var writeStream = fs.createWriteStream(filePath, {
		flags: 'w',
		defaultEncoding: 'binary'
	})

	stream.pipe(writeStream)

	writeStream.on('error', cb)
	writeStream.on('finish', function() {
		cb(null)
	})
}
