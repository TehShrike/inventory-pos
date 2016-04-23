var test = require('tape')
var db = require('./db-helpers')

test('splitIntoObjects', function(t) {
	const output = db.splitIntoObjects({
		thingOne: 'one',
		thingTwo: 'two',
		hurgleBurgleOne: 'hone',
		hurgleBlargleTwo: 'htwo'
	}, ['thing', 'hurgle'])

	t.deepEqual(output, {
		thing: {
			one: 'one',
			two: 'two'
		},
		hurgle: {
			burgleOne: 'hone',
			blargleTwo: 'htwo'
		}
	})

	t.end()
})
