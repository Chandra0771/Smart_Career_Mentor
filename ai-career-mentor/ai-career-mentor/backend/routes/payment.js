const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckout, webhook, getPaymentStatus } = require('../controllers/paymentController');

router.post('/create-checkout', protect, createCheckout);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);
router.get('/status', protect, getPaymentStatus);

module.exports = router;
