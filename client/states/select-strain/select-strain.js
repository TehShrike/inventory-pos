var all = require('async-all')
var template = require('./select-strain.html')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'app.select-strain',
		route: '/select-strain',
		querystringParameters: [ 'document' ],
		template: {
			template,
			toway: false
		},
		resolve: (data, parameters, cb) => {
			all({
				strains: cb => mediator.publish('emitToServer', 'load strains', cb),
				document: cb => mediator.publish('fetchDocument', parameters.document, (err, doc) => cb(err, doc.store.getState()))
			}, cb)
		}
	})
}
