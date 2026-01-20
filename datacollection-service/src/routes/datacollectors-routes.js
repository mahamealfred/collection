import express from 'express';
import {
  createDataCollector,
  bulkCreateDataCollectors,
  getAllDataCollectors,
  getDataCollectorById,
  updateDataCollector,
  deleteDataCollector
} from '../controllers/datacollectors-controller.js';

const router = express.Router();

// POST endpoint - Create a new data collector
// POST /datacollectors
router.post('/', createDataCollector);

// POST endpoint - Bulk create multiple data collectors
// POST /datacollectors/bulk
router.post('/bulk', bulkCreateDataCollectors);

// GET endpoint - List all data collectors with pagination
// GET /datacollectors?status=active&limit=10&offset=0
router.get('/', getAllDataCollectors);

// GET endpoint - Get a specific data collector by ID
// GET /datacollectors/:id
router.get('/:id', getDataCollectorById);

// PUT endpoint - Update a data collector
// PUT /datacollectors/:id
router.put('/:id', updateDataCollector);

// DELETE endpoint - Delete a data collector
// DELETE /datacollectors/:id
router.delete('/:id', deleteDataCollector);

export default router;
