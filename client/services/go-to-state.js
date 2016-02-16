export default function({ mediator, stateRouter}) {
	mediator.provide('goToState', stateRouter.go)
}
