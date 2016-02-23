var all = require('async-all')
var template = require('./select-room.html')
var { getActiveDocument } = require('../../documents/documents')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'app.select-room',
		route: '/select-room',
		querystringParameters: [ 'document' ],
		template: {
			template,
			toway: false
		},
		resolve: (data, parameters, cb) => {
			all({
				rooms: cb => mediator.publish('emitToServer', 'load rooms', cb),
				document: cb => getActiveDocument(mediator, parameters.document, (err, doc) => cb(err, doc.store.getState()))
			}, cb)

		}
	})
}
