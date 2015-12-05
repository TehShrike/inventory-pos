var Bacon = require('baconjs')

export function observe(ractive, objectKeypath, eventName) {
	if (!eventName) {
		eventName = objectKeypath
		objectKeypath = null
	}

	return Bacon.fromBinder(function(sink) {
		ractive.on(eventName, function(event, key) {
			var keypath = objectKeypath + '.' + key

			sink({
				[key]: ractive.get(keypath)
			})
		})
		ractive.on('teardown', function() {
			sink(new Bacon.End())
		})
	})
}

export function allProperties(value, o) {
	return Object.keys(o).reduce(function(memo, key) {
		memo[key] = value
		return memo
	}, {})
}

export function prependKeysWith(str, o) {
	return Object.keys(o).reduce(function(memo, key) {
		memo[str + key] = o[key]
		return memo
	}, {})
}

export function handleSavingStreams(streams, ractive, mainObjectProperty) {
	streams.newVersionsFromServer.onError(function(err) {
		if (err.message) {
			console.error(err.message)
			throw err
		} else {
			console.error(err)
		}
	})

	streams.newVersionsFromServer.onValue(function(newVersionFromServer) {
		ractive.set(prependKeysWith(mainObjectProperty + '.', newVersionFromServer))
	})

	streams.propertiesSavedAndGotBackFromServer.onValue(function(newlySavedProperties) {
		newlySavedProperties.map(function(property) {
			return 'saving.' + mainObjectProperty + '.' + property
		}).forEach(function(property) {
			ractive.set(property, false)
		})

		newlySavedProperties.map(function(property) {
			return 'saved.' + mainObjectProperty + '.' + property
		}).forEach(function(property) {
			ractive.set(property, true)
		})
	})

}