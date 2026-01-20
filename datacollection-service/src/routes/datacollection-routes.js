import express from 'express';
import { getExternalForms, submitFormData } from '../controllers/datacollection-controller.js';
import checkFormSubmissionLimit from '../middleware/formSubmissionLimiter.js';
import { checkAccountBalance } from '../middleware/accountBalanceChecker.js';
import checkAgentFormAccess from '../middleware/checkAgentFormAccess.js';

const router = express.Router();

// GET endpoint - Retrieve available forms
router.get('/external/forms', getExternalForms);

// POST endpoint - Submit form data
// POST /external/forms/:formId/submit
router.post('/external/forms/:formId/submit',checkAgentFormAccess, checkAccountBalance, checkFormSubmissionLimit, submitFormData);

export default router;
