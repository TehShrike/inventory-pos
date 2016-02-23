var { createLocalDocumentLoadingFunction, createLocalDocumentSaver } = require('../common/document-helpers')

const documents = {
	addPlant: require('./add-plant')
}

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
