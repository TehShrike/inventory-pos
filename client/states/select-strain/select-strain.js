var template = require('./select-strain.html')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'app.select-strain',
		route: '/select-strain',
		template: {
			template,
			toway: false
		},
		resolve: (data, parameters, cb) => {
			mediator.publish('emitToServer', 'load strains', (err, strains) => cb(err, { strains: strains }))
		}
	})
}
