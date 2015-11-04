module.exports = function(appContext) {
	appContext.mediator.provide('goToState', appContext.stateRouter.go)
}
