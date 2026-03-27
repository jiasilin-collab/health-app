const express = require('express');
const router = express.Router();
const tcmController = require('../controllers/tcmController');
const auth = require('../middleware/auth');

// 获取所有体质类型
router.get('/constitutions', tcmController.getConstitutions);

// 获取体质详情
router.get('/constitutions/:id', tcmController.getConstitutionDetail);

// 体质评估（需要认证）
router.post('/assessment', auth, tcmController.constitutionAssessment);

// 获取用户历史体质评估（需要认证）
router.get('/my-constitutions', auth, tcmController.getUserConstitutions);

module.exports = router;
