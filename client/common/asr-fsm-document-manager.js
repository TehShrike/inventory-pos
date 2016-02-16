import makeAsrStateWatcher from 'asr-active-state-watcher'
import startCrossStateDocumentBuilder from 'cross-state-document-builder'
import createFsmNavigator from 'asr-fsm-navigation'

export default function startDocumentManager(stateRouter) {
	const stateWatcher = makeAsrStateWatcher(stateRouter)
	const startDocument = startCrossStateDocumentBuilder(stateWatcher)
	const startNavigator = createFsmNavigator(stateRouter, stateWatcher)

	var documents = {}

	function createDocumentIfNecessaryAndFetch({name, reducer, initialState, fsm}) {
		if (!documents[name]) {
			const doc = startDocument(reducer, initialState)
			const stopNavigation = startNavigator(fsm)

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

	return {
		fetchDocument: name => documents[name],
		createDocumentIfNecessaryAndFetch: createDocumentIfNecessaryAndFetch
	}
}
