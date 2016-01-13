var connectionPoolFactory = require('connection-pool-factory')
var pool = connectionPoolFactory()

var pgpcDb = require('db/plant-growth-phase-change-db')(pool)

pgpcDb.save({
	plant_growth_phase_change_id: undefined,
	plant_id: 1,
	date: new Date(),
	from_growth_phase: 'immature',
	to_growth_phase: 'vegetative'
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
