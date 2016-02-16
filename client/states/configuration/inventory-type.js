import Ractive from 'ractive'
import makeSavingStream from 'bacon-form-saving'
import { observe, allProperties, prependKeysWith, handleSavingStreams} from '../../observe'
import template from './inventory-type.html'

export default function createInventoryTypeComponent(mediator) {
	return Ractive.extend({
		template: template,
		isolated: true,
		data: function() {
			return {
				saving: {},
				saved: {}
			}
		},
		oncomplete: function() {
			var ractive = this

			var allFieldChangesStream = observe(ractive, 'inventoryType', 'inventory-type-change')

			allFieldChangesStream.onValue(function(changes) {
				ractive.set(allProperties(true, prependKeysWith('saving.inventoryType.', changes)))
			})

			var streams = makeSavingStream(allFieldChangesStream, ractive.get('inventoryType'), 'inventoryTypeId', function(inventoryType, cb) {
				mediator.publish('emitToServer', 'save inventory type', inventoryType, cb)
			})

			handleSavingStreams(streams, ractive, 'inventoryType')
		}
	})
}
