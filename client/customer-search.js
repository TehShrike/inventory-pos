var fs = require('fs')
var Bacon = require('baconjs')
var horsey = require('horsey')
var escapeHtml = require('html-escape')

module.exports = function(appContext) {
	var socket = appContext.socket
	appContext.stateRouter.addState({
		name: 'app.customer-search',
		route: 'customer-search',
		template: fs.readFileSync('client/customer-search.html', { encoding: 'utf8' }),
		activate: function(context) {
			var ractive = context.domApi

			var customerSearchInput = ractive.find('.customer-search')
			var customerSearchForm = ractive.find('.customer-search-form')

			customerSearchInput.focus()

			var autocomplete = horsey(customerSearchInput, {
				form: customerSearchForm,
				appendTo: customerSearchForm,
				suggestions: function(value, done) {
					if (value.length >= 2) {
						socket.emit('customer search', value, function(err, suggestions) {
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
				},
				set: function(customer) {
					appContext.stateRouter.go('app.customer', { customerId: customer.customerId })
				},
				listClass: 'list-group',
				selectedClass: 'active',
				itemClass: 'list-group-item cursor-pointer'
			})

			function customerTypeLabel(customer) {
				if (customer.customerType === 'medical') {
					return '<span class="pull-right light label label-success">Medical</span>'
				} else if (customer.customerType === 'recreational') {
					return '<span class="pull-right light label label-info">Recreational</span>'
				} else {
					return ''
				}
			}

			context.on('destroy', function() {
				autocomplete.destroy()
			})

			function saveCustomer(customer, cb) {
				socket.emit('save customer', customer, cb)
			}

			handleNewCustomerEvent(Bacon.fromEvent(ractive, 'new-medical'), 'medical')
			handleNewCustomerEvent(Bacon.fromEvent(ractive, 'new-recreational'), 'recreational')

			function handleNewCustomerEvent(stream, type) {
				var saving = stream.map(function(event) {
					return {
						name: ractive.get('autocomplete'),
						customerType: type
					}
				}).flatMap(function(newCustomer) {
					return Bacon.fromNodeCallback(saveCustomer, newCustomer)
				})

				saving.onValue(function(customer) {
					appContext.stateRouter.go('app.customer', { customerId: customer.customerId })
				})
				saving.onError(function(err) {
					console.error(err)
				})
			}
		}
	})
}

