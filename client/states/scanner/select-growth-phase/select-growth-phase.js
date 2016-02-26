var all = require('async-all')
var template = require('./select-growth-phase.html')
var { getActiveDocument } = require('../../../documents/documents')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'scanner.select-growth-phase',
		route: '/select-growth-phase',
		querystringParameters: [ 'document' ],
		template: {
			template,
			toway: false
		},
		resolve: (data, parameters, cb) => {
			all({
				document: cb => getActiveDocument(mediator, parameters.document, (err, doc) => cb(err, doc.store.getState()))
			}, cb)
		}
	})
}
