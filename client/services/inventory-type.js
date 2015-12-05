var makeCallWhenLoaded = require('../call-when-loaded')
var extend = require('xtend')

module.exports = function(appContext) {
	var socket = appContext.socket
	var mapOfIdsToTypes = null
	var topLevelTypes = null

	var callWhenLoaded = null

	function parseRows(rows) {
		mapOfIdsToTypes = {}
		topLevelTypes = []

		rows.forEach(function(inventoryType) {
			mapOfIdsToTypes[inventoryType.inventoryTypeId] = inventoryType
			inventoryType.children = []
			if (inventoryType.parentInventoryTypeId === null) {
				topLevelTypes.push(inventoryType)
			}
		})

		rows.filter(function(inventoryType) {
			return inventoryType.parentInventoryTypeId !== null
		}).forEach(function(inventoryType) {
			if (inventoryType.parentInventoryTypeId !== null) {
				mapOfIdsToTypes[inventoryType.parentInventoryTypeId].children.push(inventoryType)
			}
		})
	}

	function load() {
		mapOfIdsToTypes = null
		topLevelTypes = null

		callWhenLoaded = makeCallWhenLoaded()

		socket.emit('load inventory types', function(err, rows) {
			if (err) {
				console.error(err.message || err)
			} else {
				parseRows(rows)
				callWhenLoaded.markLoaded()
			}
		})
	}

	load()

	socket.on('saved inventory type', function() {
		if (!callWhenLoaded.isLoading()) {
			load()
		}
	})

	appContext.mediator.provide('getInventoryType', function(inventoryTypeId, cb) {
		callWhenLoaded(function() {
			if (mapOfIdsToTypes[inventoryTypeId]) {
				cb(null, extend(mapOfIdsToTypes[inventoryTypeId]))
			} else {
				cb(new Error('inventoryTypeId ' + inventoryTypeId + ' not found'))
			}
		})
	})

	appContext.mediator.provide('getTopLevelInventoryTypes', function(cb) {
		callWhenLoaded(function() {
			cb(null, topLevelTypes.map(function(type) {
				return extend(type)
			}))
		})
	})

	appContext.mediator.provide('getAncestors', function(inventoryTypeId, cb) {
		callWhenLoaded(function() {
			if (mapOfIdsToTypes[inventoryTypeId]) {
				var current = mapOfIdsToTypes[inventoryTypeId]
				var ancestors = [ current ]
				while (current.parentInventoryTypeId) {
					current = mapOfIdsToTypes[current.parentInventoryTypeId]
					ancestors.push(current)
				}
				cb(null, ancestors.reverse())
			} else {
				cb(new Error('inventoryTypeId ' + inventoryTypeId + ' not found'))
			}
		})
	})
}
