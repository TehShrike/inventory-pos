var fs = require('fs')
var Bacon = require('baconjs')
var all = require('async-all')

module.exports = function(appContext) {
	var mediator = appContext.mediator

	appContext.stateRouter.addState({
		name: 'app.add-plant',
		route: 'add-plant',
		parameters: ['inventoryTypeId'],
		template: {
			template: fs.readFileSync('client/states/add-plant/add-plant.html', { encoding: 'utf8' })
		},
		resolve: function(data, parameters, cb) {
			all({
				plantInventoryTypes: cb => {
					if (parameters.inventoryTypeId) {
						mediator.publish('emitToServer', 'load child plants', parameters.inventoryTypeId, cb)
					} else {
						mediator.publish('emitToServer', 'load top level plants', cb)
					}
				}
			}, cb)
		},
		activate: function(context) {
			var ractive = context.domApi

			ractive.set('buttonColumns', buttonColumnsPerInventoryTypeCount(context.content.plantInventoryTypes.length))
		}
	})
}

function buttonColumnsPerInventoryTypeCount(things) {
	if (things === 1) {
		return 12
	} else if (things === 2) {
		return 6
	} else if (things === 3) {
		return 4
	} else if (things === 4) {
		return 3
	} else if (things >= 5 && things <= 6) {
		return 4
	} else if (things >= 7) {
		return 3
	}
}
