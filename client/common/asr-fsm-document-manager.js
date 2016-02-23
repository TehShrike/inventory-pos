var makeAsrStateWatcher = require('asr-active-state-watcher')
var startCrossStateDocumentBuilder = require('cross-state-document-builder/es5')
var createFsmNavigator = require('asr-fsm-navigation')

module.exports = function startDocumentManager(stateRouter) {
	const stateWatcher = makeAsrStateWatcher(stateRouter)
	const startDocument = startCrossStateDocumentBuilder(stateWatcher)
	const startNavigator = createFsmNavigator(stateRouter, stateWatcher)

	var documents = {}

	function createDocumentIfNecessaryAndFetch({name, reducer, initialState, fsm, middlewares}) {
		if (!documents[name]) {
			const currentState = typeof initialState === 'function' ? initialState() : initialState
			const doc = startDocument(reducer, currentState, middlewares)
			const stopNavigation = startNavigator(fsm, {
				inherit: false
			})

			documents[name] = {
				store: doc.store,
				fsm: fsm,
				stop: () => {
					doc.finishDocument()
					stopNavigation()
				}
			}
		}

		return documents[name]
	}

	function finishDocumentAndReturnStore(name) {
		if (documents[name]) {
			let doc = documents[name]

			doc.stop()

			delete documents[name]

			return doc.store
		}
	}

	return {
		fetchDocument: name => documents[name],
		createDocumentIfNecessaryAndFetch: createDocumentIfNecessaryAndFetch,
		finishDocument: finishDocumentAndReturnStore
	}
}
