module.exports = function({ mediator, stateRouter}) {
	mediator.provide('goToState', stateRouter.go)
}
