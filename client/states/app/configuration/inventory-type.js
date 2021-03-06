var Ractive = require('ractive')
var makeSavingStream = require('bacon-form-saving')
var { observe, allProperties, prependKeysWith, handleSavingStreams} = require('../../../observe')
var template = require('./inventory-type.html')

module.exports = function createInventoryTypeComponent(mediator) {
	return Ractive.extend({
		template,
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
