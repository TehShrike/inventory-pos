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
