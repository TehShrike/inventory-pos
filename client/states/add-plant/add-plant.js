var fs = require('fs')
var all = require('async-all')
var { switchForNamedArgs, makeReducer } = require('../../common/action-helpers.js')
var { combineReducers } = require('redux')
var { reducer: addPlantReducer } = require('../../documents/add-plant.js')

module.exports = function(appContext) {
	var mediator = appContext.mediator

	appContext.stateRouter.addState({
		name: 'app.add-plant',
		route: 'add-plant',
		querystringParameters: ['inventoryTypeId'],
		template: {
			template: fs.readFileSync('client/states/add-plant/add-plant.html', { encoding: 'utf8' }),
			twoway: false
		},
		data: {
			reducer: combineReducers({
				addPlant: addPlantReducer,
				other: makeReducer({
					SCAN_PLANT: (state, action) => state
				})
			}),
			afterAction: switchForNamedArgs({

			})
		},
		resolve: function(data, parameters, cb) {
			cb(null, {})
		},
		activate: function(context) {
			var ractive = context.domApi
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
