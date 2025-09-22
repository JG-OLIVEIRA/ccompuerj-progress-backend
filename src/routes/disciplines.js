import express from 'express';
import { handleGetAllDisciplines, handleGetDisciplineById, handleGetClassInDiscipline, handleScrapeDisciplines, handleScrapeWhatsappLinks, handleUpdateWhatsappGroup } from '../controllers/disciplines.controller.js';

const router = express.Router();

/**
 * @swagger
 * /disciplines:
 *   get:
 *     summary: Returns all disciplines.
 *     responses:
 *       200:
 *         description: A list of all disciplines.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discipline'
 */
router.get('/', handleGetAllDisciplines);

/**
 * @swagger
 * /disciplines/{id}:
 *   get:
 *     summary: Returns a discipline by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the discipline.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The discipline corresponding to the ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discipline'
 *       404:
 *         description: Discipline not found.
 */
router.get('/:id', handleGetDisciplineById);

/**
 * @swagger
 * /disciplines/{id}/classes/{classNumber}:
 *   get:
 *     summary: Returns a specific class from a discipline.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the discipline.
 *         schema:
 *           type: string
 *       - in: path
 *         name: classNumber
 *         required: true
 *         description: The number of the class.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The specific class from the discipline.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Discipline or class not found.
 */
router.get('/:id/classes/:classNumber', handleGetClassInDiscipline);

/**
 * @swagger
 * /disciplines/actions/scrape:
 *   post:
 *     summary: Forces an update of the disciplines database by scraping data from Aluno Online.
 *     responses:
 *       202:
 *         description: Disciplines update process started.
 */
router.post('/actions/scrape', handleScrapeDisciplines);

/**
 * @swagger
 * /disciplines/actions/scrape-whatsapp:
 *   post:
 *     summary: Forces an update of the WhatsApp group links by scraping a public HackMD page.
 *     responses:
 *       202:
 *         description: WhatsApp link scraping process started.
 */
router.post('/actions/scrape-whatsapp', handleScrapeWhatsappLinks);

/**
 * @swagger
 * /disciplines/{id}/classes/{classNumber}:
 *   patch:
 *     summary: Updates the WhatsApp group link for a specific class.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the discipline.
 *         schema:
 *           type: string
 *       - in: path
 *         name: classNumber
 *         required: true
 *         description: The number of the class.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsappGroup:
 *                 type: string
 *                 description: The WhatsApp group link.
 *     responses:
 *       200:
 *         description: WhatsApp group updated successfully.
 *       404:
 *         description: Discipline or class not found.
 *       500:
 *         description: Error updating the WhatsApp group.
 */
router.patch('/:id/classes/:classNumber', handleUpdateWhatsappGroup);

export default router;
