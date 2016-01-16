CREATE DATABASE pos;
USE pos;

CREATE TABLE customer (
	customer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(500) NOT NULL,
	drivers_license VARCHAR(20) NOT NULL,
	social_security VARCHAR(20) NOT NULL,
	phone_number VARCHAR(30) NOT NULL,
	customer_type ENUM('recreational', 'medical', 'wholesale'),
	version INT UNSIGNED NOT NULL,
	PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE inventory_type (
	inventory_type_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(300) NOT NULL,
	parent_id INT UNSIGNED NULL,
	sellable BIT(1) NOT NULL,
	version INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (inventory_type_id),
	UNIQUE INDEX name (name(200))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE inventory_type
	CHANGE COLUMN parent_id parent_inventory_type_id INT UNSIGNED NULL;

ALTER TABLE inventory_type
	ADD COLUMN plant BIT(1) NOT NULL DEFAULT 0;


CREATE TABLE strain (
	strain_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	version INT UNSIGNED NOT NULL,
	PRIMARY KEY (strain_id),
	UNIQUE KEY name (name)
) ENGINE=InnoDB;

CREATE TABLE plant (
	plant_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	tag_scope VARCHAR(20),
	tag_number VARCHAR(50),
	strain_id INT UNSIGNED NOT NULL,
	room_id INT UNSIGNED NOT NULL,
	growth_phase ENUM('immature','vegetative','flowering','harvested','packaged') NOT NULL,
	version INT UNSIGNED NOT NULL,
	PRIMARY KEY (plant_id),
	UNIQUE KEY tag (tag_scope, tag_number),
	KEY strain (strain_id),
	KEY room (room_id)
) ENGINE=InnoDB;

CREATE TABLE plant_move (
	plant_move_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	plant_id INT UNSIGNED NOT NULL,
	date DATETIME NOT NULL,
	from_room_id INT UNSIGNED NOT NULL,
	to_room_id INT UNSIGNED NOT NULL,
	PRIMARY KEY (plant_move_id),
	KEY plant (plant_id),
	KEY from_room (from_room_id),
	KEY to_room (to_room_id)
) ENGINE=InnoDB;

CREATE TABLE plant_growth_phase_change (
	plant_growth_phase_change_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	plant_id INT UNSIGNED NOT NULL,
	date DATETIME NOT NULL,
	from_growth_phase ENUM('immature','vegetative','flowering','harvested','packaged') NOT NULL,
	to_growth_phase ENUM('immature','vegetative','flowering','harvested','packaged') NOT NULL,
	PRIMARY KEY (plant_growth_phase_change_id),
	KEY plant (plant_id)
) ENGINE=InnoDB;

CREATE TABLE harvest (
	harvest_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	started DATETIME NOT NULL,
	ended DATETIME,
	version INT UNSIGNED NOT NULL,
	PRIMARY KEY (harvest_id)
) ENGINE=InnoDB;

CREATE TABLE harvest_plant (
	harvest_plant_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	harvest_id INT UNSIGNED NOT NULL,
	plant_id INT UNSIGNED NOT NULL,
	package_id INT UNSIGNED NOT NULL,
	PRIMARY KEY (harvest_plant_id),
	UNIQUE KEY (plant_id),
	KEY (harvest_id),
	KEY (package_id)
) ENGINE=InnoDB;

ALTER TABLE inventory_type
	ADD COLUMN package BIT(1) NOT NULL AFTER sellable;

CREATE TABLE package (
	package_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	tag_scope VARCHAR(20),
	tag_number VARCHAR(50),
	PRIMARY KEY (package_id),
	UNIQUE KEY tag (tag_scope, tag_number)
) ENGINE=InnoDB;

CREATE TABLE room (
	room_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	identifier VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	version INT UNSIGNED NOT NULL,
	PRIMARY KEY (room_id),
	UNIQUE KEY identifier (identifier),
	UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE inventory_type
	ADD COLUMN unit ENUM('each', 'ounce') NOT NULL DEFAULT 'each';

CREATE TABLE inventory (
	inventory_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	inventory_type_id INT UNSIGNED NOT NULL,
	quantity DECIMAL (12,5) NOT NULL DEFAULT 0,
	package_id INT UNSIGNED NULL,
	room_id INT UNSIGNED,
	version INT UNSIGNED NOT NULL,
	PRIMARY KEY (inventory_id),
	UNIQUE INDEX package (package_id),
	INDEX inventory_type (inventory_type_id),
	INDEX room (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE inventory_room_move (
	inventory_room_move_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	inventory_id INT UNSIGNED NOT NULL,
	from_room_id INT UNSIGNED NOT NULL,
	to_room_id INT UNSIGNED NOT NULL,
	PRIMARY KEY (inventory_room_move_id),
	INDEX inventory (inventory_id),
	INDEX from_room (from_room_id),
	INDEX to_room (to_room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE inventory_quantity_transfer (
	inventory_quantity_transfer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	from_inventory_id INT UNSIGNED NOT NULL,
	from_unit ENUM('each', 'ounce') NOT NULL,
	from_quantity DECIMAL (12,5) NOT NULL,
	to_inventory_id INT UNSIGNED NOT NULL,
	to_unit ENUM('each', 'ounce') NOT NULL,
	to_quantity DECIMAL (12,5) NOT NULL,
	PRIMARY KEY (inventory_quantity_transfer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
