CREATE DATABASE IF NOT EXISTS payment_gateway
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE payment_gateway;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(150),
    role ENUM('buyer','merchant') DEFAULT 'buyer',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_wallet_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    senderId INT NOT NULL,
    receiverId INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',

    type ENUM('purchase','transfer') DEFAULT 'purchase',

    status ENUM('pending','processing','completed','failed') DEFAULT 'pending',

    externalOrderRef VARCHAR(255),

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_sender
    FOREIGN KEY (senderId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_payment_receiver
    FOREIGN KEY (receiverId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    paymentId INT NOT NULL,

    action ENUM('debit','credit') NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    description TEXT,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_payment
    FOREIGN KEY (paymentId) REFERENCES payments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    paymentId INT,

    eventType VARCHAR(100),

    payload JSON,

    responseCode INT,

    sent BOOLEAN DEFAULT FALSE,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_webhook_payment
    FOREIGN KEY (paymentId) REFERENCES payments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;