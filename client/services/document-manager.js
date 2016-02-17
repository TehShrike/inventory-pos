const createDocumentManager = require('../common/asr-fsm-document-manager.js')

module.exports = function mediatorApi({ mediator, stateRouter }) {
	const { createDocumentIfNecessaryAndFetch, fetchDocument } = createDocumentManager(stateRouter)

	mediator.provide('createDocumentIfNecessaryAndFetch', (documentDetails, cb) => {
		cb(null, createDocumentIfNecessaryAndFetch(documentDetails))
	})
	mediator.provide('fetchDocument', (name, cb) => cb(null, fetchDocument(name)))
}
