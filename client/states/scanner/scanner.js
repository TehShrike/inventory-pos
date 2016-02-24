var template = require('./scanner.html')

module.exports = function({ stateRouter }) {
	stateRouter.addState({
		name: 'scanner',
		template: template,
		defaultChild: 'menu',
		route: '/scanner'
	})
}
