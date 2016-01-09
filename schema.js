// customer
Joi.object({
	customer_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(500).invalid(null),
	drivers_license: Joi.string().max(20).invalid(null),
	social_security: Joi.string().max(20).invalid(null),
	phone_number: Joi.string().max(30).invalid(null),
	customer_type: Joi.any().valid('recreational','medical','wholesale').allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// harvest
Joi.object({
	harvest_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	started: Joi.date().invalid(null),
	ended: Joi.date().allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// harvest_plant
Joi.object({
	harvest_plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	harvest_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	package_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// inventory
Joi.object({
	inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	inventory_type_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	quantity: Joi.number().precision(5).less(10000000).invalid(null),
	package_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	room_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// inventory_quantity_transfer
Joi.object({
	inventory_quantity_transfer_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	from_inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	from_unit: Joi.any().valid('each','ounce').invalid(null),
	from_quantity: Joi.number().precision(5).less(10000000).invalid(null),
	to_inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_unit: Joi.any().valid('each','ounce').invalid(null),
	to_quantity: Joi.number().precision(5).less(10000000).invalid(null)
})
// inventory_room_move
Joi.object({
	inventory_room_move_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	from_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// inventory_type
Joi.object({
	inventory_type_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(300).invalid(null),
	parent_inventory_type_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	sellable: Joi.boolean().invalid(null),
	package: Joi.boolean().invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant: Joi.boolean().invalid(null),
	unit: Joi.any().valid('each','ounce').invalid(null)
})
// package
Joi.object({
	package_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20).allow(null),
	tag_number: Joi.string().max(50).allow(null)
})
// plant
Joi.object({
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20).allow(null),
	tag_number: Joi.string().max(50).allow(null),
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// plant_growth_phase_change
Joi.object({
	plant_growth_phase_change_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	to_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null)
})
// plant_move
Joi.object({
	plant_change_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// room
Joi.object({
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	identifier: Joi.string().max(50).invalid(null),
	name: Joi.string().max(50).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
// strain
Joi.object({
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(50).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
})
