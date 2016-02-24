var template = require('./menu.html')

module.exports = function({ stateRouter }) {
	stateRouter.addState({
		name: 'scanner.menu',
		route: 'menu',
		querystringParameters: ['inventoryTypeId'],
		template: template
	})
}
