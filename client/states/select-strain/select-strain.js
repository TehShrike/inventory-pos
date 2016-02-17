var fs = require('fs')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'app.select-strain',
		route: '/select-strain',
		template: {
			template: fs.readFileSync('client/states/select-strain/select-strain.html', { encoding: 'utf8' }),
			toway: false
		},
		resolve: (data, parameters, cb) => {
			mediator.publish('emitToServer', 'load strains', (err, strains) => cb(err, { strains: strains }))
		}
	})
}
