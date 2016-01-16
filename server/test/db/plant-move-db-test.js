var connectionPoolFactory = require('connection-pool-factory')
var pool = connectionPoolFactory()

var pgpcDb = require('db/plant-move-db')(pool)

pgpcDb.save({
	plant_move_id: undefined,
	plant_id: 1,
	date: new Date(),
	from_room_id: 3,
	to_room_id: 4
}, function(err, result) {
	if (err) {
		console.log(err.message || err)
	} else {
		console.log('inserted', result)
	}
})

pgpcDb.load(1, function(err, data) {
	console.dir(data, { depth: null })
})
