var fs = require('fs')
var all = require('async-all')
var inventoryTypeComponent = require('./inventory-type')

module.exports = function(appContext) {
	var mediator = appContext.mediator

	appContext.stateRouter.addState({
		name: 'app.configuration',
		route: 'config',
		defaultChild: 'inventory-type',
		template: fs.readFileSync('client/states/configuration/configuration.html', { encoding: 'utf8' })
	})

	appContext.stateRouter.addState({
		name: 'app.configuration.inventory-type',
		route: 'inventorytype/:inventoryTypeId(\\d+)?',
		template: {
			template: fs.readFileSync('client/states/configuration/inventory-type-list.html', { encoding: 'utf8' }),
			components: {
				inventoryType: inventoryTypeComponent(appContext.mediator)
			}
		},
		resolve: function(data, parameters, cb) {
			all({
				inventoryTypesAtThisLevel: function(cb) {
					if (parameters.inventoryTypeId) {
						mediator.request('getInventoryType', parameters.inventoryTypeId, function(err, inventoryType) {
							cb(err, inventoryType && inventoryType.children)
						})
					} else {
						mediator.request('getTopLevelInventoryTypes', cb)
					}
				},
				ancestors: function(cb) {
					var topLevel = [{
						inventoryTypeId: null,
						name: 'All'
					}]

					if (parameters.inventoryTypeId) {
						mediator.request('getAncestors', parameters.inventoryTypeId, function(err, ancestors) {
							cb(err, ancestors && topLevel.concat(ancestors))
						})
					} else {
						cb(null, topLevel)
					}
				}
			}, cb)
		},
		activate: function(context) {
			var ractive = context.domApi

			ractive.on('add-new-type', function() {
				ractive.set('showingAddNewTypeInput', true)
				ractive.find('.add-new-type-input').focus()
			})

			ractive.on('create-new-inventory-type', function(event, name) {
				var parent = context.content.ancestors[context.content.ancestors.length - 1]

				var newInventoryType = {
					name: name,
					parentInventoryTypeId: context.parameters.inventoryTypeId || null,
					sellable: typeof parent.sellable === 'boolean' ? parent.sellable : true,
					plant: typeof parent.plant === 'boolean' ? parent.plant : false,
					version: 0
				}

				ractive.set({
					savingNewInventoryType: true,
					errorMessage: null
				})

				mediator.publish('emitToServer', 'save inventory type', newInventoryType, function(err, savedType) {
					if (err) {
						ractive.set({
							savingNewInventoryType: false,
							errorMessage: err.message
						})
					} else {
						ractive.set({
							savingNewInventoryType: false,
							showingAddNewTypeInput: false,
							newInventoryTypeName: ''
						})
						ractive.get('inventoryTypesAtThisLevel').push(savedType)
					}
				})
			})
		}
	})
}
