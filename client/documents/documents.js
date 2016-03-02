var { createLocalDocumentLoadingFunction, createLocalDocumentSaver } = require('../common/document-helpers')

const documents = {
	addPlant: require('./add-plant')
}

function assertSet(o, name) {
	if (typeof o[name] === 'undefined') {
		console.warn('Missing property', name)
	}
}

// Development sanity check
Object.keys(documents).forEach(name => {
	assertSet(documents[name], 'reducer')
	assertSet(documents[name], 'fsm')
})

module.exports.getActiveDocument = function getActiveDocument(mediator, documentType, cb) {
	const reducer = documents[documentType].reducer
	const fsm = documents[documentType].fsm

	mediator.request('createDocumentIfNecessaryAndFetch', {
		name: documentType,
		reducer: reducer,
		fsm,
		initialState: createLocalDocumentLoadingFunction(documentType),
		middlewares: [createLocalDocumentSaver(documentType)]
	}, cb)
}