import template from './select-strain.html'

export default function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'app.select-strain',
		route: '/select-strain',
		template: {
			template: template,
			toway: false
		},
		resolve: (data, parameters, cb) => {
			mediator.publish('emitToServer', 'load strains', (err, strains) => cb(err, { strains: strains }))
		}
	})
}
