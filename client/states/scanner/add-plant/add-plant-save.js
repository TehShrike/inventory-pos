var { deleteLocalDocument } = require('../../../common/document-helpers')
var template = require('./add-plant-save.html')

module.exports = function({ stateRouter, mediator }) {
	function cleanUpDocumentAndGoToMainMenu() {
		mediator.publish('finishDocument', 'addPlant', store => {
			deleteLocalDocument('addPlant')
			stateRouter.go('scanner')
		})
	}

	stateRouter.addState({
		name: 'scanner.add-plant-save',
		route: 'add-plant/save',
		template: {
			template
		},
		resolve: function(data, parameters, cb) {
			mediator.request('fetchDocument', 'addPlant', (err, doc) => {
				if (err) {
					cb(err)
				} else if (!doc) {
					cb.redirect('scanner.add-plant')
				} else {
					cb(err, {
						addPlant: doc.store.getState()
					})
				}
			})
		},
		activate: function({ domApi }) {
			cleanUpDocumentAndGoToMainMenu()
			// TODO: actually save
		}
	})
}
