var template = require('./menu.html')

module.exports = function({ mediator, stateRouter }) {
	stateRouter.addState({
		name: 'scanner.menu',
		route: 'menu',
		querystringParameters: ['inventoryTypeId'],
		template: template,
		activate: function(context) {
			const unsubscribe = mediator.subscribe('barcodeScan', barcode => stateRouter.go('scanner.plant', { tagNumber: barcode }))

			context.on('destroy', unsubscribe)
		}
	})
}
