import { Router } from 'express';
import { RequestHandler } from 'express';
import {
  setAlertThreshold,
  getAlertThreshold,
  getAllAlertThresholds,
  deleteAlertThreshold,
  getAlerts
} from '../controllers/alert.controller';

const router = Router();

// 设置告警阈值
router.post('/thresholds', setAlertThreshold as RequestHandler);

// 获取所有告警阈值
router.get('/thresholds', getAllAlertThresholds as RequestHandler);

// 获取特定接口的告警阈值
router.get('/thresholds/:interface', getAlertThreshold as RequestHandler);

// 删除告警阈值
router.delete('/thresholds/:interface', deleteAlertThreshold as RequestHandler);

// 获取所有告警
router.get('/alerts', getAlerts as RequestHandler);

export default router; 