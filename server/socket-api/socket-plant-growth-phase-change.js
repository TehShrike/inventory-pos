const plantGrowthPhaseChangeSaver = require('documents/plant-growth-phase-change-saver')
const { serializeErrorForCallback } = require('socket-server-util')


module.exports = function({ userId, accountId }, socket, broadcast) {

	// socket.on('load plant growth phase change', serializeErrorPassedToLastCallback(plantGrowthPhaseChangeDb.load))
	socket.on('save plant growth phase change document', function(growthPhaseChangeDocument, cb) {
		plantGrowthPhaseChangeSaver({ userId, growthPhaseChangeDocument }, serializeErrorForCallback(cb))
	})
}
