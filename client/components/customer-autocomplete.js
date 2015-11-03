var fs = require('fs')
var Ractive = require('ractive')
var horsey = require('horsey')
var escapeHtml = require('html-escape')

module.exports = function createComponent(appContext) {
	return Ractive.extend({
		template: fs.readFileSync('client/components/customer-autocomplete.html', { encoding: 'utf8' }),
		isolated: true,
		oncomplete: function() {
			var ractive = this

			var customerSearchInput = ractive.find('.customer-search')
			var customerSearchForm = ractive.find('.customer-search-form')

			customerSearchInput.focus()

			var autocomplete = horsey(customerSearchInput, {
				form: customerSearchForm,
				appendTo: customerSearchForm,
				suggestions: function(value, done) {
					if (value.length >= 2) {
						appContext.socket.emit('customer search', value, function(err, suggestions) {
							if (err) {
								throw err
							} else {
								done(suggestions)
							}
						})
					} else {
						done([])
					}
				},
				filter: function(value, suggestions) {
					return suggestions
				},
				getValue: function(suggestion) {
					return suggestion
				},
				render: function(li, suggestion) {
					li.innerHTML = escapeHtml(suggestion.name) + customerTypeLabel(suggestion)
					li.setAttribute('type', 'button')
				},
				set: function(customer) {
					appContext.stateRouter.go('app.customer', { customerId: customer.customerId })
				},
				liElement: 'button',
				listClass: 'list-group',
				selectedClass: 'active',
				itemClass: 'list-group-item'
			})

			ractive.on('unrender', function() {
				autocomplete.destroy()
			})

		}
	})
}

function customerTypeLabel(customer) {
	if (customer.customerType === 'medical') {
		return '<span class="pull-right light label label-success">Medical</span>'
	} else if (customer.customerType === 'recreational') {
		return '<span class="pull-right light label label-info">Recreational</span>'
	} else {
		return ''
	}
}

