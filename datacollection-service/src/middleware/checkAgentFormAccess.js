import logger from '../utils/logger.js';
import sequelize from '../db/config.js';
import { QueryTypes } from 'sequelize';
import jwt from 'jsonwebtoken';

/**
 * Middleware to verify that the agent username (from token) is authorized to submit forms with the given formId
 * Checks the datacollectors table to ensure the agent has permission for this form
 */
const checkAgentFormAccess = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const authHeader = req.headers.authorization;

    if (!formId) {
      logger.warn('Missing formId in request params');
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
        data: null
      });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header');
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required',
        data: null
      });
    }

    // Extract token from Authorization header
    const token = authHeader.substring(7);
    
    // Decode token to get username (adjust according to your token structure)
    let username;
    try {
      const decoded = jwt.decode(token);
      username = decoded?.username || decoded?.user?.username || decoded?.sub;
      
      if (!username) {
        logger.warn('Username not found in token');
        return res.status(401).json({
          success: false,
          message: 'Invalid token: username not found',
          data: null
        });
      }
    } catch (error) {
      logger.warn('Failed to decode token', { error: error.message });
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token',
        data: null
      });
    }

    // Check if this agent has access to this formId in the datacollectors table
    const agentRecord = await sequelize.query(
      'SELECT id, username, formId, status FROM datacollectors WHERE username = ? AND formId = ?',
      {
        replacements: [username, formId],
        type: QueryTypes.SELECT
      }
    );

    if (agentRecord.length === 0) {
      logger.warn('Agent not authorized for form submission', {
        username,
        formId
      });
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to submit forms with this form',
        data: null
      });
    }

    // Check if agent status is active
    if (agentRecord[0].status !== 'active') {
      logger.warn('Agent account is not active', {
        username,
        status: agentRecord[0].status
      });
      return res.status(403).json({
        success: false,
        message: `Agent account is ${agentRecord[0].status}. Cannot submit forms.`,
        data: null
      });
    }

    // Attach agent info to request for use in controller
    req.agent = {
      id: agentRecord[0].id,
      username: agentRecord[0].username,
      formId: agentRecord[0].formId,
      status: agentRecord[0].status
    };

    logger.info('Agent authorized for form submission', {
      username,
      formId,
      agentId: agentRecord[0].id
    });

    next();
  } catch (error) {
    logger.error('Error in checkAgentFormAccess middleware', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying agent authorization',
      data: null
    });
  }
};

export default checkAgentFormAccess;
