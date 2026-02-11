CREATE TABLE `RefreshTokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL,
  `userId` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `agentCategory` VARCHAR(100) NOT NULL,
  `userAuth` VARCHAR(255) NOT NULL,
  `expiresAt` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refreshtokens_token` (`token`),
  KEY `idx_refreshtokens_expiresat` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transactions_status (
    ID INT(11) NOT NULL AUTO_INCREMENT,
    transactionId VARCHAR(10) DEFAULT NULL,
    customerId VARCHAR(50) DEFAULT NULL,
    token VARCHAR(255) DEFAULT NULL,
    thirdpart_status VARCHAR(20) DEFAULT NULL,
    service_name VARCHAR(25) DEFAULT NULL,
    status VARCHAR(20) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    amount DECIMAL(10,2) DEFAULT NULL,
    agent_name VARCHAR(20) DEFAULT NULL,
    transaction_reference VARCHAR(50) DEFAULT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE transactions_status
ADD COLUMN customerId VARCHAR(50) NULL AFTER transactionId,
ADD COLUMN token VARCHAR(255) NULL AFTER customerId;

ALTER TABLE transactions_status
ADD COLUMN agent_id VARCHAR(50) NULL AFTER agent_name;

ALTER TABLE transactions_status
ADD COLUMN customer_charge DECIMAL(10,2) DEFAULT NULL AFTER amount;

CREATE TABLE `aqs_data_collection` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `formId` VARCHAR(100) NOT NULL,
  `submissionId` VARCHAR(100) UNIQUE,
  `customerId` VARCHAR(50) NOT NULL,
  `agentId` VARCHAR(50),
  `formData` LONGTEXT NOT NULL COMMENT 'JSON formatted form data',
  `status` VARCHAR(50) NOT NULL DEFAULT 'submitted' COMMENT 'submitted, processing, completed, failed',
  `thirdPartyStatus` VARCHAR(50) DEFAULT NULL COMMENT 'Status from external API',
  `externalResponse` LONGTEXT COMMENT 'Full response from external API',
  `formTitle` VARCHAR(255),
  `formDescription` TEXT,
  `organizationId` VARCHAR(100),
  `organizationName` VARCHAR(255),
  `syncStatus` VARCHAR(50) DEFAULT NULL COMMENT 'synced, pending, failed',
  `submitterType` VARCHAR(50) DEFAULT 'api' COMMENT 'api, web, mobile',
  `submitterDisplay` VARCHAR(255),
  `submitterApiKeyName` VARCHAR(255),
  `validationStatus` VARCHAR(50) DEFAULT NULL COMMENT 'valid, invalid',
  `validationErrors` LONGTEXT COMMENT 'JSON array of validation errors',
  `workflowCurrentStep` VARCHAR(100),
  `workflowSteps` LONGTEXT COMMENT 'JSON array of workflow steps',
  `isFlagged` BOOLEAN DEFAULT FALSE,
  `apiKeyName` VARCHAR(255),
  `externalId` VARCHAR(100),
  `errorMessage` TEXT,
  `submittedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processedAt` DATETIME,
  `completedAt` DATETIME,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_asq_submission` (`submissionId`),
  KEY `idx_asq_formId` (`formId`),
  KEY `idx_asq_customerId` (`customerId`),
  KEY `idx_asq_agentId` (`agentId`),
  KEY `idx_asq_status` (`status`),
  KEY `idx_asq_submittedAt` (`submittedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores ASQ data collection form submissions';

CREATE TABLE `datacollectors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique username/agent ID',
  `fullName` VARCHAR(255) NOT NULL,
  `formId` VARCHAR(100) NOT NULL COMMENT 'Associated form ID',
  `status` VARCHAR(50) NOT NULL DEFAULT 'active' COMMENT 'active, inactive, suspended',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_datacollectors_username` (`username`),
  KEY `idx_datacollectors_status` (`status`),
  KEY `idx_datacollectors_formId` (`formId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores data collector agent information';

CREATE TABLE `collection_notification` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `initiatorReferenceId` VARCHAR(255) NOT NULL COMMENT 'Unique initiator reference ID',
  `fspReferenceId` VARCHAR(255) DEFAULT NULL COMMENT 'FSP (Financial Service Provider) reference ID',
  `pgReferenceId` VARCHAR(255) DEFAULT NULL COMMENT 'Payment Gateway reference ID',
  `amount` VARCHAR(50) NOT NULL COMMENT 'Transaction amount',
  `status` VARCHAR(50) NOT NULL COMMENT 'Transaction status (e.g., success, failed, pending)',
  `message` TEXT DEFAULT NULL COMMENT 'Status message or description',
  `operator` VARCHAR(100) DEFAULT NULL COMMENT 'Operator name (e.g., Airtel, MTN, etc.)',
  `additionalProperties` LONGTEXT DEFAULT NULL COMMENT 'JSON object storing dynamic additional properties',
  `receivedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when callback was received',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_collection_notification_initiatorReferenceId` (`initiatorReferenceId`),
  KEY `idx_collection_notification_fspReferenceId` (`fspReferenceId`),
  KEY `idx_collection_notification_pgReferenceId` (`pgReferenceId`),
  KEY `idx_collection_notification_status` (`status`),
  KEY `idx_collection_notification_operator` (`operator`),
  KEY `idx_collection_notification_receivedAt` (`receivedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores callback data from payment providers';

CREATE TABLE `money_collection` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `referenceId` VARCHAR(255) NOT NULL COMMENT 'Unique reference ID generated by system',
  `operationReferenceId` VARCHAR(255) DEFAULT NULL COMMENT 'Reference ID returned by Azampay',
  `provider` VARCHAR(50) NOT NULL COMMENT 'Payment provider (e.g., mtn, airtel)',
  `customerAccountNumber` VARCHAR(50) NOT NULL COMMENT 'Customer phone number to collect from',
  `customerName` VARCHAR(255) NOT NULL COMMENT 'Customer name',
  `currencyCode` VARCHAR(10) NOT NULL DEFAULT 'RWF' COMMENT 'Currency code',
  `amount` DECIMAL(10,2) NOT NULL COMMENT 'Collection amount',
  `status` VARCHAR(50) NOT NULL COMMENT 'Transaction status (pending, success, failed)',
  `message` TEXT DEFAULT NULL COMMENT 'Status message or description',
  `agentId` VARCHAR(100) DEFAULT NULL COMMENT 'Agent ID who initiated the collection',
  `transactionId` VARCHAR(50) DEFAULT NULL COMMENT 'Cyclos transaction ID after crediting agent float',
  `requestPayload` LONGTEXT DEFAULT NULL COMMENT 'JSON request payload sent to Azampay',
  `responsePayload` LONGTEXT DEFAULT NULL COMMENT 'JSON response received from Azampay',
  `additionalProperties` LONGTEXT DEFAULT NULL COMMENT 'JSON object storing additional properties',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Transaction creation timestamp',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_money_collection_referenceId` (`referenceId`),
  KEY `idx_money_collection_operationReferenceId` (`operationReferenceId`),
  KEY `idx_money_collection_provider` (`provider`),
  KEY `idx_money_collection_status` (`status`),
  KEY `idx_money_collection_agentId` (`agentId`),
  KEY `idx_money_collection_customerAccountNumber` (`customerAccountNumber`),
  KEY `idx_money_collection_createdAt` (`createdAt`),
  KEY `idx_money_collection_transactionId` (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores money collection transactions via Azampay';

-- Table: urubutopay_payers
CREATE TABLE `urubutopay_payers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `merchant_code` VARCHAR(100) NOT NULL,
  `merchant_name` VARCHAR(255) DEFAULT NULL,
  `merchant_short_name` VARCHAR(255) DEFAULT NULL,
  `merchant_short_code` VARCHAR(100) DEFAULT NULL,
  `payer_code` VARCHAR(100) NOT NULL,
  `payer_names` VARCHAR(255) DEFAULT NULL,
  `amount` DECIMAL(18,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'RWF',
  `payer_must_pay_total_amount` VARCHAR(10) DEFAULT 'NO',
  `comment` TEXT DEFAULT NULL,
  `payer_to_be_charged` VARCHAR(10) DEFAULT 'NO',
  `accept_card_payment` VARCHAR(10) DEFAULT 'NO',
  `need_term_and_year` VARCHAR(10) DEFAULT 'NO',
  `number_of_term` INT DEFAULT 0,
  `term_label_name` VARCHAR(50) DEFAULT NULL,
  `commission_rate` DECIMAL(10,4) DEFAULT 0,
  `card_commission_rate` DECIMAL(10,4) DEFAULT 0,
  `services` JSON DEFAULT NULL,
  `card_currency` VARCHAR(10) DEFAULT 'RWF',
  `wallet_bank_settlement` VARCHAR(100) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_urubutopay_payers_unique` (`merchant_code`,`payer_code`),
  KEY `idx_urubutopay_payers_merchant_code` (`merchant_code`),
  KEY `idx_urubutopay_payers_payer_code` (`payer_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: urubutopay_payment_notifications
CREATE TABLE `urubutopay_payment_notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` INT DEFAULT NULL,
  `transaction_status` VARCHAR(255) DEFAULT NULL,
  `merchant_code` VARCHAR(100) DEFAULT NULL,
  `payer_code` VARCHAR(100) DEFAULT NULL,
  `payment_channel` VARCHAR(255) DEFAULT NULL,
  `payment_channel_name` VARCHAR(255) DEFAULT NULL,
  `amount` DECIMAL(18,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'RWF',
  `payment_date_time` DATETIME DEFAULT NULL,
  `callback_type` VARCHAR(100) DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `payment_purpose` VARCHAR(255) DEFAULT NULL,
  `payment_purpose_code` VARCHAR(255) DEFAULT NULL,
  `bank_name` VARCHAR(255) DEFAULT NULL,
  `bank_account` VARCHAR(255) DEFAULT NULL,
  `observation` TEXT DEFAULT NULL,
  `term` VARCHAR(50) DEFAULT NULL,
  `academic_year` VARCHAR(50) DEFAULT NULL,
  `initial_slip_number` VARCHAR(255) DEFAULT NULL,
  `slip_number` VARCHAR(255) DEFAULT NULL,
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `internal_transaction_id` VARCHAR(255) DEFAULT NULL,
  `external_transaction_id` VARCHAR(255) DEFAULT NULL,
  `commission_amount` DECIMAL(18,2) DEFAULT NULL,
  `payer_phone_number` VARCHAR(50) DEFAULT NULL,
  `payer_email` VARCHAR(255) DEFAULT NULL,
  `raw_payload` LONGTEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_urubutopay_notifications_merchant` (`merchant_code`),
  KEY `idx_urubutopay_notifications_payer` (`payer_code`),
  KEY `idx_urubutopay_notifications_reference` (`internal_transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

