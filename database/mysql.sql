CREATE DATABASE IF NOT EXISTS governor_project;
USE governor_project;


CREATE TABLE IF NOT EXISTS subcounties (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY subcounties_name_key (name)
) ENGINE=InnoDB;

INSERT INTO subcounties (id, name) VALUES
    (1, 'Teso South'),
    (2, 'Teso North'),
    (3, 'Matayos'),
    (4, 'Funyula'),
    (5, 'Butula'),
    (6, 'Budalangi'),
    (7, 'Nambale')
ON DUPLICATE KEY UPDATE name = VALUES(name);


CREATE TABLE IF NOT EXISTS ward (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subcounty_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY ward_name_subcounty_key (name, subcounty_id),

    CONSTRAINT ward_subcounty_fk
        FOREIGN KEY (subcounty_id)
        REFERENCES subcounties(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO ward (name, subcounty_id) VALUES
    ('Amukura Central', 1),
    ('Amukura East', 1),
    ('Amukura West', 1),
    ('Angorom', 1),
    ('Chakol North', 1),
    ('Chakol South', 1),
    ('Angurai East', 2),
    ('Angurai North', 2),
    ('Angurai South', 2),
    ('Malaba Central', 2),
    ('Malaba North', 2),
    ('Malaba South', 2),
    ('Bukhayo West', 3),
    ('Burumba', 3),
    ('Busibwabo', 3),
    ('Matayos South', 3),
    ('Mayenje', 3),
    ('Agenga''', 4),
    ('Bwiri', 4),
    ('Namboboto Nambuku', 4),
    ('Nangina', 4),
    ('Bukhayo Central', 7),
    ('Bukhayo East', 7),
    ('Bukhayo North/Walatsi', 7),
    ('Nambale Township', 7),
    ('Bunyala Central', 6),
    ('Bunyala North', 6),
    ('Bunyala South', 6),
    ('Bunyala West', 6),
    ('Elugulu', 5),
    ('Kingandole', 5),
    ('Marachi Central', 5),
    ('Marachi East', 5),
    ('Marachi North', 5),
    ('Marachi West', 5)
ON DUPLICATE KEY UPDATE name = VALUES(name);


CREATE TABLE IF NOT EXISTS sublocation (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ward_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY sublocation_name_ward_key (name, ward_id),

    CONSTRAINT sublocation_ward_fk
        FOREIGN KEY (ward_id)
        REFERENCES ward(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS villages (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sublocation_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY villages_name_sublocation_key (name, sublocation_id),

    CONSTRAINT villages_sublocation_fk
        FOREIGN KEY (sublocation_id)
        REFERENCES sublocation(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS citizens (
    id INT AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    sex ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    phone_number VARCHAR(20),
    village_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT citizens_village_fk
        FOREIGN KEY (village_id)
        REFERENCES villages(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    ward_id INT NOT NULL,
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    progress INT NOT NULL DEFAULT 0,
    budget DECIMAL(12,2) DEFAULT 0,
    actual_cost DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT projects_ward_fk
        FOREIGN KEY (ward_id)
        REFERENCES ward(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS project_updates (
    id INT AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(255),
    update_text TEXT NOT NULL,
    progress INT NOT NULL,
    status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT project_updates_project_fk
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;
