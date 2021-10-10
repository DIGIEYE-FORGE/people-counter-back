const express = require('express');
const authRoutes = require('./auth.route');
const areaRoutes = require('./area.route');
const placeRoutes = require('./place.route');
const deviceRoutes = require('./device.route');
const configRoutes = require('./config.route');
const eventRoutes = require('./event.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/areas', areaRoutes);
router.use('/places', placeRoutes);
router.use('/devices', deviceRoutes);
router.use('/configs', configRoutes);
router.use('/events', eventRoutes);
router.use('/auth', authRoutes);

module.exports = router;
