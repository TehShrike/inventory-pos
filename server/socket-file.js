var serializeUtil = require('socket-server-util')
var fileHelpers = require('file-helpers')
var socketStream = require('socket.io-stream')

var serializeErrorPassedToLastCallback = serializeUtil.serializeErrorPassedToLastCallback
var getFileStreamHandler = fileHelpers.getFileStreamHandler
var checkFileExists = fileHelpers.checkFileExists

module.exports = function(config, socket) {
	var customerDriversLicenseDirectory = config.imageDirectories.customerDriversLicense
	var customerPrescriptionDirectory = config.imageDirectories.customerPrescription

	socket.on('drivers license exists', serializeErrorPassedToLastCallback(checkFileExists.bind(null, customerDriversLicenseDirectory)))
	socket.on('prescription exists', serializeErrorPassedToLastCallback(checkFileExists.bind(null, customerPrescriptionDirectory)))

	socketStream(socket).on('save drivers license', getFileStreamHandler(customerDriversLicenseDirectory, 'customerId'))
	socketStream(socket).on('save prescription', getFileStreamHandler(customerPrescriptionDirectory, 'customerId'))

}
