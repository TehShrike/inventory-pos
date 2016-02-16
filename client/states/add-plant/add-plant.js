import { switchForNamedArgs, makeReducer } from 'action-helpers.js'
import { combineReducers } from 'redux'
import { addPlantReducer as reducer } from '../../documents/add-plant.js'
import template from './add-plant.html'

export default function({ stateRouter }) {
	stateRouter.addState({
		name: 'app.add-plant',
		route: 'add-plant',
		querystringParameters: ['inventoryTypeId'],
		template: {
			template: template,
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
