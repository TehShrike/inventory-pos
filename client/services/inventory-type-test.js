var test = require('tape')
var InventoryTypeService = require('./inventory-type')
var EventEmitter = require('events').EventEmitter
var mannish = require('mannish')

test('loads things and then returns then', function(t) {
	var socketIoMock = new EventEmitter()
	var mediator = mannish()

	t.plan(2)

	socketIoMock.on('load inventory types', function(cb) {
		setTimeout(function() {
			cb(null, [ { inventoryTypeId: 1,
			    name: 'Baked goods',
			    parentId: null,
			    sellable: true },
			  { inventoryTypeId: 3,
			    name: 'Commercial flowers',
			    parentId: null,
			    sellable: true },
			  { inventoryTypeId: 5,
			    name: 'Other Commercial',
			    parentId: null,
			    sellable: true },
			  { inventoryTypeId: 2,
			    name: 'Plants',
			    parentId: null,
			    sellable: false },
			  { inventoryTypeId: 4,
			    name: 'Nuka Cola',
			    parentId: 2,
			    sellable: true },
			  { inventoryTypeId: 8, name: 'Green', parentId: 4, sellable: true },
			  { inventoryTypeId: 9,
			    name: 'Orange',
			    parentId: 4,
			    sellable: true },
			  { inventoryTypeId: 6,
			    name: 'Shatter',
			    parentId: 5,
			    sellable: true } ])
		}, 500)
	})

	InventoryTypeService({
		socket: socketIoMock,
		mediator: mediator
	})

	mediator.request('getInventoryType', 2, function(err, inventoryType) {
		t.equal(inventoryType.name, 'Plants')

		mediator.request('getTopLevelInventoryTypes', function(err, inventoryTypes) {
			t.equal(inventoryTypes.length, 4)
			t.end()
		})
	})
})
