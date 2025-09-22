import express from 'express';
import {
    handleGetAllStudents,
    handleGetStudentById,
    handleGetStudentDisciplines,
    handleGetStudentDisciplineById,
    handleCreateStudent,
    handleUpdateStudent,
    handleAddCompletedDiscipline,
    handleRemoveCompletedDiscipline,
    handleEnrollStudentInClass,
    handleRemoveStudentFromClass,
    handleDeleteStudent
} from '../controllers/students.controller.js';

const router = express.Router();

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Returns a list of all students with their credit counts.
 *     responses:
 *       200:
 *         description: A list of students with their mandatory and elective credit totals.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Student'
 *                   - type: object
 *                     properties:
 *                       mandatoryCredits:
 *                         type: integer
 *                         description: Total credits from completed mandatory disciplines.
 *                       electiveCredits:
 *                         type: integer
 *                         description: Total credits from completed elective disciplines.
 *       500:
 *         description: Error retrieving the students.
 */
router.get('/', handleGetAllStudents);

/**
 * @swagger
 * /students/{studentId}:
 *   get:
 *     summary: Returns a student by their ID with their credit counts.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: The ID of the student to be returned.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student returned successfully with credit totals.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Student'
 *                 - type: object
 *                   properties:
 *                     mandatoryCredits:
 *                       type: integer
 *                       description: Total credits from completed mandatory disciplines.
 *                     electiveCredits:
 *                       type: integer
 *                       description: Total credits from completed elective disciplines.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Error retrieving the student.
 */
router.get('/:studentId', handleGetStudentById);

/**
 * @swagger
 * /students/{studentId}/disciplines:
 *   get:
 *     summary: Returns all disciplines with their status for a specific student.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of all disciplines with their status for the student.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DisciplineWithStatus'
 *       404:
 *         description: Student not found.
 */
router.get('/:studentId/disciplines', handleGetStudentDisciplines);

/**
 * @swagger
 * /students/{studentId}/disciplines/{disciplineId}:
 *   get:
 *     summary: Returns a single discipline with its status for a specific student.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: disciplineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The discipline with its status for the student.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisciplineWithStatus'
 *       404:
 *         description: Student or Discipline not found.
 */
router.get('/:studentId/disciplines/:disciplineId', handleGetStudentDisciplineById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Creates a new student.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - name
 *               - lastName
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: '20201010101'
 *               name:
 *                 type: string
 *                 example: 'John'
 *               lastName:
 *                 type: string
 *                 example: 'Doe'
 *               completedDisciplines:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['IMH001', 'IMH002']
 *     responses:
 *       201:
 *         description: Student created successfully.
 *       400:
 *         description: The student ID, name, and last name are required.
 *       409:
 *         description: A student with the same ID already exists.
 *       500:
 *         description: Error creating the student.
 */
router.post('/', handleCreateStudent);

/**
 * @swagger
 * /students/{studentId}:
 *   patch:
 *     summary: Partially updates a student's information (name and/or lastName).
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John'
 *               lastName:
 *                 type: string
 *                 example: 'Doe'
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Error updating the student.
 */
router.patch('/:studentId', handleUpdateStudent);

/**
 * @swagger
 * /students/{studentId}/completed-disciplines/{disciplineId}:
 *   put:
 *     summary: Adds a single completed discipline to a student's record.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: disciplineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline added successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Error updating the student.
 */
router.put('/:studentId/completed-disciplines/:disciplineId', handleAddCompletedDiscipline);

/**
 * @swagger
 * /students/{studentId}/completed-disciplines/{disciplineId}:
 *   delete:
 *     summary: Removes a single completed discipline from a student's record.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: disciplineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline removed successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Error updating the student.
 */
router.delete('/:studentId/completed-disciplines/:disciplineId', handleRemoveCompletedDiscipline);

/**
 * @swagger
 * /students/{studentId}/current-disciplines/{disciplineId}/{classNumber}:
 *   put:
 *     summary: Enrolls a student in a specific class of a discipline.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: disciplineId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: classNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student enrolled successfully.
 *       404:
 *         description: Student or discipline not found.
 *       500:
 *         description: Error enrolling the student.
 */
router.put('/:studentId/current-disciplines/:disciplineId/:classNumber', handleEnrollStudentInClass);

/**
 * @swagger
 * /students/{studentId}/current-disciplines/{disciplineId}/{classNumber}:
 *   delete:
 *     summary: Removes a student's enrollment from a specific class.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: disciplineId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: classNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment removed successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Error removing enrollment.
 */
router.delete('/:studentId/current-disciplines/:disciplineId/:classNumber', handleRemoveStudentFromClass);

/**
 * @swagger
 * /students/{studentId}:
 *   delete:
 *     summary: Deletes a student by their ID.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: The ID of the student to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Error deleting the student.
 */
router.delete('/:studentId', handleDeleteStudent);

export default router;
