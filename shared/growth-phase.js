const growthPhases = [ 'immature','vegetative','flowering','harvested','packaged' ]

module.exports.list = growthPhases
module.exports.getNext = function getNextGrowthPhase(phase) {
	const current = growthPhases.indexOf(phase)
	if (current === -1 || !growthPhases[current + 1]) {
		throw new Error('Could not find growth phase ' + phase)
	}

	return growthPhases[current + 1]
}
module.exports.getPrevious = function getPreviousGrowthPhase(phase) {
	const current = growthPhases.indexOf(phase)
	if (current <= 0) {
		throw new Error('Could not find a growth phase before ' + phase)
	}

	return growthPhases[current - 1]
}
