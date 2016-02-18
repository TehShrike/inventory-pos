var template = require('./select-room.html')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'app.select-room',
		route: '/select-room',
		template: {
			template,
			toway: false
		},
		resolve: (data, parameters, cb) => {
			mediator.publish('emitToServer', 'load rooms', (err, rooms) => cb(err, { rooms: rooms }))
		}
	})
}
