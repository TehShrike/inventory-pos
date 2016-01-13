// rm schema.js;
// echo "// customer" >> schema.js;
// joi-sql --schema pos --table customer >> schema.js;
// echo "// harvest" >> schema.js;
// joi-sql --schema pos --table harvest >> schema.js;
// echo "// harvest_plant" >> schema.js;
// joi-sql --schema pos --table harvest_plant >> schema.js;
// echo "// inventory" >> schema.js;
// joi-sql --schema pos --table inventory >> schema.js;
// echo "// inventory_quantity_transfer" >> schema.js;
// joi-sql --schema pos --table inventory_quantity_transfer >> schema.js;
// echo "// inventory_room_move" >> schema.js;
// joi-sql --schema pos --table inventory_room_move >> schema.js;
// echo "// inventory_type" >> schema.js;
// joi-sql --schema pos --table inventory_type >> schema.js;
// echo "// package" >> schema.js;
// joi-sql --schema pos --table package >> schema.js;
// echo "// plant" >> schema.js;
// joi-sql --schema pos --table plant >> schema.js;
// echo "// plant_growth_phase_change" >> schema.js;
// joi-sql --schema pos --table plant_growth_phase_change >> schema.js;
// echo "// plant_move" >> schema.js;
// joi-sql --schema pos --table plant_move >> schema.js;
// echo "// room" >> schema.js;
// joi-sql --schema pos --table room >> schema.js;
// echo "// strain" >> schema.js;
// joi-sql --schema pos --table strain >> schema.js;


// customer
{
	customer_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(500).invalid(null),
	drivers_license: Joi.string().max(20).invalid(null),
	social_security: Joi.string().max(20).invalid(null),
	phone_number: Joi.string().max(30).invalid(null),
	customer_type: Joi.any().valid('recreational','medical','wholesale').allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// harvest
{
	harvest_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	started: Joi.date().invalid(null),
	ended: Joi.date().allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// harvest_plant
{
	harvest_plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	harvest_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	package_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// inventory
{
	inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	inventory_type_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	quantity: Joi.number().precision(5).less(10000000).invalid(null),
	package_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	room_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// inventory_quantity_transfer
{
	inventory_quantity_transfer_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	from_inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	from_unit: Joi.any().valid('each','ounce').invalid(null),
	from_quantity: Joi.number().precision(5).less(10000000).invalid(null),
	to_inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_unit: Joi.any().valid('each','ounce').invalid(null),
	to_quantity: Joi.number().precision(5).less(10000000).invalid(null)
}
// inventory_room_move
{
	inventory_room_move_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	from_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// inventory_type
{
	inventory_type_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(300).invalid(null),
	parent_inventory_type_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	sellable: Joi.boolean().invalid(null),
	package: Joi.boolean().invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant: Joi.boolean().invalid(null),
	unit: Joi.any().valid('each','ounce').invalid(null)
}
// package
{
	package_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20).allow(null),
	tag_number: Joi.string().max(50).allow(null)
}
// plant
{
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20).allow(null),
	tag_number: Joi.string().max(50).allow(null),
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// plant_growth_phase_change
{
	plant_growth_phase_change_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	to_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null)
}
// plant_move
{
	plant_change_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// room
{
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	identifier: Joi.string().max(50).invalid(null),
	name: Joi.string().max(50).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
// strain
{
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(50).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}
