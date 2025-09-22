import express from 'express';
import { handleGetAllTeachers } from '../controllers/teachers.controller.js';

const router = express.Router();

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Returns a list of all unique teachers.
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A list of teachers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *       500:
 *         description: Error retrieving teachers.
 */
router.get('/', handleGetAllTeachers);

export default router;
