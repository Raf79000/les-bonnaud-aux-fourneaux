-- 1) Users
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_username` (`username`),
  UNIQUE KEY `ux_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) RecipeBook
CREATE TABLE IF NOT EXISTS `recipe_book` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recipebook_user` (`user_id`),
  CONSTRAINT `fk_recipebook_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Ingredient
CREATE TABLE IF NOT EXISTS `ingredient` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_ingredient_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) Recipe
CREATE TABLE IF NOT EXISTS `recipe` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(255),
  `preparation_time` INT UNSIGNED NOT NULL COMMENT 'minutes',
  `difficulty` ENUM('EASY','MEDIUM','HARD') NOT NULL DEFAULT 'MEDIUM',
  `category` ENUM('STARTER','MAIN_COURSE','DESSERT','ALL') NOT NULL DEFAULT 'ALL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_recipe_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) RecipeIngredient (join table between Recipe and Ingredient)
CREATE TABLE IF NOT EXISTS `recipe_ingredient` (
  `recipe_id` INT UNSIGNED NOT NULL,
  `ingredient_id` INT UNSIGNED NOT NULL,
  `weight` DECIMAL(8,2) DEFAULT NULL COMMENT 'grams, optional',
  `quantity` INT UNSIGNED DEFAULT NULL COMMENT 'number of items, optional',
  PRIMARY KEY (`recipe_id`,`ingredient_id`),
  KEY `fk_reciping_recipe` (`recipe_id`),
  KEY `fk_reciping_ingredient` (`ingredient_id`),
  CONSTRAINT `fk_reciping_recipe`
    FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_reciping_ingredient`
    FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) Junction table: RecipeBook ↔ Recipe (many-to-many)
CREATE TABLE IF NOT EXISTS `recipe_book_recipe` (
  `recipe_book_id` INT UNSIGNED NOT NULL,
  `recipe_id`     INT UNSIGNED NOT NULL,
  PRIMARY KEY (`recipe_book_id`,`recipe_id`),
  KEY `fk_rbr_recipebook` (`recipe_book_id`),
  KEY `fk_rbr_recipe` (`recipe_id`),
  CONSTRAINT `fk_rbr_recipebook`
    FOREIGN KEY (`recipe_book_id`) REFERENCES `recipe_book` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_rbr_recipe`
    FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) Junction table: User ↔ Favorite Recipes (many-to-many)
CREATE TABLE IF NOT EXISTS `user_favorite_recipe` (
  `user_id`   INT UNSIGNED NOT NULL,
  `recipe_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `fk_ufr_user` (`user_id`),
  KEY `fk_ufr_recipe` (`recipe_id`),
  CONSTRAINT `fk_ufr_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_ufr_recipe`
    FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
