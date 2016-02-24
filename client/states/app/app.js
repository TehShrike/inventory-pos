var template = require('./app.html')

module.exports = function({ stateRouter }) {
	stateRouter.addState({
		name: 'app',
		template,
		route: '/app'
	})
}
