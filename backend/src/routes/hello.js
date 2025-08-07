import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/hello
 * @desc    Example route for testing
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

export default router;