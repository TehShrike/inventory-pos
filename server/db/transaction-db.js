module.exports = function transactionDb(connection) {
	var released = false
	function releaseAndThen(cb) {
		return function(...args) {
			if (released) {
				throw new Error('The connection was already released')
			}
			connection.release()
			released = true
			cb.apply(null, args)
		}
	}

	function ensureNotReleasedAndThen(fn) {
		return function(...args) {
			if (released) {
				throw new Error('The connection was already released')
			}
			fn.apply(null, args)
		}
	}
	return {
		start: cb => connection.beginTransaction(cb),
		commit: ensureNotReleasedAndThen(cb => connection.commit(releaseAndThen(cb))),
		rollback: ensureNotReleasedAndThen(cb => connection.rollback(releaseAndThen(cb)))
	}
}
