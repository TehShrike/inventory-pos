module.exports = function({ socket, mediator }) {
	mediator.provide('emitToServer', function() {
		socket.emit.apply(socket, arguments)
	})
}
