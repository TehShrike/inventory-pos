module.exports.createLocalDocumentLoadingFunction = function createLocalDocumentLoadingFunction(documentIdentifier, defaultInitialState) {
	return function documentLoader() {
		const serializedDocument = localStorage.getItem(documentIdentifier)
		return serializedDocument ? JSON.parse(serializedDocument) : defaultInitialState
	}
}

module.exports.createLocalDocumentSaver = function createLocalDocumentSaver(documentIdentifier) {
	function save(state) {
		process.nextTick(() => {
			localStorage.setItem(documentIdentifier, JSON.stringify(state))
		})
	}

	return function documentSaverMiddleware({ getState, dispatch }) {
		return next => action => {
			next(action)
			save(getState())
		}
	}
}

module.exports.deleteLocalDocument = function deleteLocalDocument(documentIdentifier) {
	process.nextTick(() => localStorage.removeItem(documentIdentifier))
}
