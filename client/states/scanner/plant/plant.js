const template = require('./plant.html')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.plant',
		route: 'plant/:tagNumber',
		template: {
			template,
			twoway: false
		},
		resolve: function(data, parameters, cb) {
			mediator.request('emitToServer', 'load plant details by tag number', parameters.tagNumber, (err, plantDetails) => {
				if (err) return cb(err)

				plantDetails = plantDetails || {}
				plantDetails.parameters = parameters
				cb(null, plantDetails)
			})
		},
		activate: function(context) {
			const unsubscribe = mediator.subscribe('barcodeScan', barcode => stateRouter.go('scanner.plant', { tagNumber: barcode }))

			context.on('destroy', unsubscribe)
		}
	})
}
