const express = require('express');
const { validateAffiliateController } = require('./user.controller');

const router = express.Router();

router.post('/validate', validateAffiliateController);

module.exports = router;
