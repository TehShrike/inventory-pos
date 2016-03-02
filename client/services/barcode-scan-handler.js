module.exports = function barcodeScanHandler({ mediator }) {
	// Intentionally global for the Linea Pro hardware to find
	(window || global).processBarcode = function process(barcode) {
		mediator.publish('barcodeScan', barcode)
	}
}
