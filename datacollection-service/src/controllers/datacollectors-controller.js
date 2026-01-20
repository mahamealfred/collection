import logger from '../utils/logger.js';
import { createResponse, createErrorResponse } from '@moola/shared';
import sequelize from '../db/config.js';
import { QueryTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create a new data collector (agent)
 * POST /datacollectors
 * Requires: username (unique), fullName, status
 */
export const createDataCollector = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { username, fullName, formId, status = 'active' } = req.body;

    // Validate required fields
    if (!username || !fullName || !formId) {
      logger.warn('Missing required fields for data collector creation', {
        username: !!username,
        fullName: !!fullName,
        formId: !!formId
      });
      return res.status(400).json(
        createErrorResponse('Missing required fields: username, fullName, and formId are required', 'VALIDATION_ERROR')
      );
    }

    // Validate status value
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      logger.warn('Invalid status provided', { status });
      return res.status(400).json(
        createErrorResponse('Invalid status. Must be one of: active, inactive, suspended', 'VALIDATION_ERROR')
      );
    }

    // Check if username already exists
    const existingCollector = await sequelize.query(
      'SELECT id FROM datacollectors WHERE username = ?',
      {
        replacements: [username],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (existingCollector.length > 0) {
      await transaction.rollback();
      logger.warn('Username already exists', { username });
      return res.status(409).json(
        createErrorResponse('Username already exists', 'DUPLICATE_ERROR')
      );
    }

    // Create new data collector
    const result = await sequelize.query(
      'INSERT INTO datacollectors (username, fullName, formId, status) VALUES (?, ?, ?, ?)',
      {
        replacements: [username, fullName, formId, status],
        transaction
      }
    );

    await transaction.commit();

    logger.info('Data collector created successfully', {
      username,
      fullName,
      formId,
      status
    });

    return res.status(201).json({
      success: true,
      message: 'Data collector created successfully',
      data: {
        id: result[0],
        username,
        fullName,
        formId,
        status,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating data collector', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      createErrorResponse('Failed to create data collector', 'SERVER_ERROR')
    );
  }
};

/**
 * Get all data collectors
 * GET /datacollectors
 * Optional query params: status, limit, offset
 */
export const getAllDataCollectors = async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 10, 100);
    const parsedOffset = parseInt(offset) || 0;

    let query = 'SELECT * FROM datacollectors';
    const replacements = [];

    if (status) {
      query += ' WHERE status = ?';
      replacements.push(status);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    const total = countResult[0].total;

    // Get paginated results
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    replacements.push(parsedLimit, parsedOffset);

    const collectors = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    logger.info('Retrieved data collectors', {
      count: collectors.length,
      total,
      status: status || 'all',
      limit: parsedLimit,
      offset: parsedOffset
    });

    return res.status(200).json({
      success: true,
      message: 'Data collectors retrieved successfully',
      data: {
        collectors,
        pagination: {
          total,
          limit: parsedLimit,
          offset: parsedOffset,
          hasMore: parsedOffset + parsedLimit < total
        }
      }
    });
  } catch (error) {
    logger.error('Error retrieving data collectors', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      createErrorResponse('Failed to retrieve data collectors', 'SERVER_ERROR')
    );
  }
};

/**
 * Get a single data collector by ID
 * GET /datacollectors/:id
 */
export const getDataCollectorById = async (req, res) => {
  try {
    const { id } = req.params;

    const collector = await sequelize.query(
      'SELECT * FROM datacollectors WHERE id = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );

    if (collector.length === 0) {
      logger.warn('Data collector not found', { id });
      return res.status(404).json(
        createErrorResponse('Data collector not found', 'NOT_FOUND')
      );
    }

    logger.info('Retrieved data collector', { id });
    return res.status(200).json({
      success: true,
      message: 'Data collector retrieved successfully',
      data: collector[0]
    });
  } catch (error) {
    logger.error('Error retrieving data collector', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      createErrorResponse('Failed to retrieve data collector', 'SERVER_ERROR')
    );
  }
};

/**
 * Update a data collector
 * PUT /datacollectors/:id
 * Can update: fullName, status
 */
export const updateDataCollector = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { fullName, formId, status } = req.body;

    if (!fullName && !formId && !status) {
      await transaction.rollback();
      return res.status(400).json(
        createErrorResponse('At least one field (fullName, formId or status) must be provided', 'VALIDATION_ERROR')
      );
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['active', 'inactive', 'suspended'];
      if (!validStatuses.includes(status)) {
        await transaction.rollback();
        return res.status(400).json(
          createErrorResponse('Invalid status. Must be one of: active, inactive, suspended', 'VALIDATION_ERROR')
        );
      }
    }

    // Check if collector exists
    const collector = await sequelize.query(
      'SELECT * FROM datacollectors WHERE id = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (collector.length === 0) {
      await transaction.rollback();
      logger.warn('Data collector not found for update', { id });
      return res.status(404).json(
        createErrorResponse('Data collector not found', 'NOT_FOUND')
      );
    }

    // Build update query dynamically
    let updateQuery = 'UPDATE datacollectors SET ';
    const updates = [];
    const replacements = [];

    if (fullName) {
      updates.push('fullName = ?');
      replacements.push(fullName);
    }
    if (formId) {
      updates.push('formId = ?');
      replacements.push(formId);
    }
    if (status) {
      updates.push('status = ?');
      replacements.push(status);
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    updateQuery += updates.join(', ');
    updateQuery += ' WHERE id = ?';
    replacements.push(id);

    await sequelize.query(updateQuery, {
      replacements,
      transaction
    });

    await transaction.commit();

    const updatedCollector = { ...collector[0], ...req.body, updatedAt: new Date().toISOString() };

    logger.info('Data collector updated successfully', {
      id,
      updates: Object.keys(req.body)
    });

    return res.status(200).json({
      success: true,
      message: 'Data collector updated successfully',
      data: updatedCollector
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error updating data collector', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      createErrorResponse('Failed to update data collector', 'SERVER_ERROR')
    );
  }
};

/**
 * Delete a data collector
 * DELETE /datacollectors/:id
 */
export const deleteDataCollector = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Check if collector exists
    const collector = await sequelize.query(
      'SELECT * FROM datacollectors WHERE id = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (collector.length === 0) {
      await transaction.rollback();
      logger.warn('Data collector not found for deletion', { id });
      return res.status(404).json(
        createErrorResponse('Data collector not found', 'NOT_FOUND')
      );
    }

    await sequelize.query(
      'DELETE FROM datacollectors WHERE id = ?',
      {
        replacements: [id],
        transaction
      }
    );

    await transaction.commit();

    logger.info('Data collector deleted successfully', { id });
    return res.status(200).json({
      success: true,
      message: 'Data collector deleted successfully',
      data: { id }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error deleting data collector', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      createErrorResponse('Failed to delete data collector', 'SERVER_ERROR')
    );
  }
};

/**
 * Bulk create multiple data collectors
 * POST /datacollectors/bulk
 * Requires: Array of {username, fullName, formId, status}
 */
export const bulkCreateDataCollectors = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { collectors } = req.body;

    // Validate input
    if (!Array.isArray(collectors)) {
      logger.warn('Invalid input: collectors must be an array');
      return res.status(400).json(
        createErrorResponse('collectors must be an array', 'VALIDATION_ERROR')
      );
    }

    if (collectors.length === 0) {
      return res.status(400).json(
        createErrorResponse('collectors array cannot be empty', 'VALIDATION_ERROR')
      );
    }

    // Limit bulk operations
    if (collectors.length > 1000) {
      return res.status(400).json(
        createErrorResponse('Cannot create more than 1000 collectors at once', 'VALIDATION_ERROR')
      );
    }

    const validStatuses = ['active', 'inactive', 'suspended'];
    const createdCollectors = [];
    const errors = [];

    // Validate each collector record
    for (let i = 0; i < collectors.length; i++) {
      const { username, fullName, formId, status = 'active' } = collectors[i];

      // Validate required fields
      if (!username || !fullName || !formId) {
        errors.push({
          index: i,
          error: 'Missing required fields: username, fullName, and formId are required'
        });
        continue;
      }

      // Validate status
      if (!validStatuses.includes(status)) {
        errors.push({
          index: i,
          error: 'Invalid status. Must be one of: active, inactive, suspended'
        });
        continue;
      }

      // Check for duplicate usernames within the batch
      const isDuplicateInBatch = createdCollectors.some(c => c.username === username);
      if (isDuplicateInBatch) {
        errors.push({
          index: i,
          username,
          error: 'Duplicate username in batch'
        });
        continue;
      }

      createdCollectors.push({ username, fullName, formId, status });
    }

    // If all records have errors, return them
    if (createdCollectors.length === 0) {
      await transaction.rollback();
      logger.warn('Bulk create failed: all records have validation errors', {
        errorCount: errors.length
      });
      return res.status(400).json(
        createErrorResponse('All records have validation errors', 'VALIDATION_ERROR', { errors })
      );
    }

    // Check for duplicate usernames in database
    const usernames = createdCollectors.map(c => c.username);
    const existingCollectors = await sequelize.query(
      `SELECT username FROM datacollectors WHERE username IN (${usernames.map(() => '?').join(',')})`,
      {
        replacements: usernames,
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (existingCollectors.length > 0) {
      await transaction.rollback();
      const duplicateUsernames = existingCollectors.map(c => c.username);
      logger.warn('Bulk create failed: duplicate usernames found', {
        duplicates: duplicateUsernames
      });
      return res.status(409).json(
        createErrorResponse('Some usernames already exist in the database', 'DUPLICATE_ERROR', {
          duplicateUsernames,
          validRecords: createdCollectors.length,
          totalRecords: collectors.length
        })
      );
    }

    // Bulk insert all valid collectors
    const insertedIds = [];
    for (const collector of createdCollectors) {
      const result = await sequelize.query(
        'INSERT INTO datacollectors (username, fullName, formId, status) VALUES (?, ?, ?, ?)',
        {
          replacements: [collector.username, collector.fullName, collector.formId, collector.status],
          transaction
        }
      );
      insertedIds.push({
        id: result[0],
        ...collector
      });
    }

    await transaction.commit();

    logger.info('Bulk data collectors created successfully', {
      createdCount: insertedIds.length,
      errorCount: errors.length,
      totalProcessed: collectors.length
    });

    return res.status(201).json({
      success: true,
      message: 'Bulk data collectors created successfully',
      data: {
        created: insertedIds,
        failed: errors,
        summary: {
          totalProcessed: collectors.length,
          successCount: insertedIds.length,
          failureCount: errors.length
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error bulk creating data collectors', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json(
      createErrorResponse('Failed to bulk create data collectors', 'SERVER_ERROR')
    );
  }
};
