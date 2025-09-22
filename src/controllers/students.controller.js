import {
    createStudent,
    getStudentById,
    getAllStudents,
    updateStudent,
    updateCompletedDisciplines,
    updateCurrentDisciplines,
    deleteStudent,
} from '../db/students.db.js';
import { getAllDisciplines, getDisciplineById } from '../db/disciplines.db.js';

// Helper function to calculate credits
const calculateCredits = (student, disciplineMap) => {
    let mandatoryCredits = 0;
    let electiveCredits = 0;

    if (student.completedDisciplines) {
        student.completedDisciplines.forEach(disciplineId => {
            const discipline = disciplineMap.get(disciplineId);
            if (discipline) {
                if (discipline.type === 'Obrigatória') {
                    mandatoryCredits += discipline.credits || 0;
                } else {
                    electiveCredits += discipline.credits || 0;
                }
            }
        });
    }

    return { mandatoryCredits, electiveCredits };
};

const handleGetAllStudents = async (req, res) => {
    try {
        const students = await getAllStudents();
        const disciplines = await getAllDisciplines();
        const disciplineMap = new Map(disciplines.map(d => [d.disciplineId, d]));

        const studentsWithCredits = students.map(student => {
            const { mandatoryCredits, electiveCredits } = calculateCredits(student, disciplineMap);
            return {
                ...student,
                mandatoryCredits,
                electiveCredits
            };
        });

        res.status(200).send(studentsWithCredits);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving students' });
    }
};

const handleGetStudentById = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await getStudentById(studentId);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const disciplines = await getAllDisciplines();
        const disciplineMap = new Map(disciplines.map(d => [d.disciplineId, d]));
        const { mandatoryCredits, electiveCredits } = calculateCredits(student, disciplineMap);

        res.status(200).send({ ...student, mandatoryCredits, electiveCredits });
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving the student' });
    }
};

const handleGetStudentDisciplines = async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);
    if (!student) {
        return res.status(404).send({ error: 'Student not found' });
    }

    const disciplines = await getAllDisciplines();
    const disciplinesWithStatus = disciplines.map(discipline => {
        let status = 'not_taken';
        if (student.completedDisciplines.includes(discipline.disciplineId)) {
            status = 'completed';
        } else if (student.currentDisciplines && student.currentDisciplines.some(enrollment => enrollment.disciplineId === discipline.disciplineId)) {
            status = 'in_progress';
        }

        const currentEnrollment = student.currentDisciplines?.find(enrollment => enrollment.disciplineId === discipline.disciplineId);
        const disciplineData = JSON.parse(JSON.stringify(discipline));

        return {
            ...disciplineData,
            status,
            enrolledClass: currentEnrollment ? currentEnrollment.classNumber : undefined
        };
    });

    res.send(disciplinesWithStatus);
};

const handleGetStudentDisciplineById = async (req, res) => {
    const { studentId, disciplineId } = req.params;

    const student = await getStudentById(studentId);
    if (!student) {
        return res.status(404).send({ error: 'Student not found' });
    }

    const discipline = await getDisciplineById(disciplineId);
    if (!discipline) {
        return res.status(404).send({ error: 'Discipline not found' });
    }

    let status = 'not_taken';
    if (student.completedDisciplines.includes(discipline.disciplineId)) {
        status = 'completed';
    } else if (student.currentDisciplines && student.currentDisciplines.some(enrollment => enrollment.disciplineId === discipline.disciplineId)) {
        status = 'in_progress';
    }

    const currentEnrollment = student.currentDisciplines?.find(enrollment => enrollment.disciplineId === discipline.disciplineId);
    const disciplineData = JSON.parse(JSON.stringify(discipline));

    res.send({
        ...disciplineData,
        status,
        enrolledClass: currentEnrollment ? currentEnrollment.classNumber : undefined
    });
};

const handleCreateStudent = async (req, res) => {
    const { studentId, name, lastName, completedDisciplines } = req.body;

    if (!studentId || !name || !lastName) {
        return res.status(400).send({ error: 'studentId, name and lastName are required' });
    }

    try {
        const existingStudent = await getStudentById(studentId);
        if (existingStudent) {
            return res.status(409).send({ error: `Student with ID ${studentId} already exists` });
        }

        await createStudent({ studentId, name, lastName, completedDisciplines: completedDisciplines || [] });
        res.status(201).send({ message: `Student ${studentId} created successfully` });
    } catch (error) {
        res.status(500).send({ error: 'Error creating student' });
    }
};

const handleUpdateStudent = async (req, res) => {
    const { studentId } = req.params;
    const { name, lastName } = req.body;

    try {
        const result = await updateStudent({ studentId, name, lastName });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send({ message: `Student ${studentId} updated successfully` });
    } catch (error) {
        res.status(500).send({ error: 'Error updating student', details: error.message });
    }
};

const handleAddCompletedDiscipline = async (req, res) => {
    const { studentId, disciplineId } = req.params;
    try {
        const result = await updateCompletedDisciplines({ studentId, add: [disciplineId] });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send({ message: `Discipline ${disciplineId} added to student ${studentId}` });
    } catch (error) {
        res.status(500).send({ error: 'Error updating the student', details: error.message });
    }
};

const handleRemoveCompletedDiscipline = async (req, res) => {
    const { studentId, disciplineId } = req.params;
    try {
        const result = await updateCompletedDisciplines({ studentId, remove: [disciplineId] });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send({ message: `Discipline ${disciplineId} removed from student ${studentId}` });
    } catch (error) {
        res.status(500).send({ error: 'Error updating the student', details: error.message });
    }
};

const handleEnrollStudentInClass = async (req, res) => {
    const { studentId, disciplineId, classNumber } = req.params;
    try {
        const result = await updateCurrentDisciplines({ studentId, disciplineId, classNumber, action: 'add' });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send({ message: `Student ${studentId} enrolled in class ${classNumber} of discipline ${disciplineId}` });
    } catch (error) {
        res.status(500).send({ error: 'Error enrolling student', details: error.message });
    }
};

const handleRemoveStudentFromClass = async (req, res) => {
    const { studentId, disciplineId, classNumber } = req.params;
    try {
        const result = await updateCurrentDisciplines({ studentId, disciplineId, classNumber, action: 'remove' });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send({ message: `Enrollment in class ${classNumber} of discipline ${disciplineId} removed for student ${studentId}` });
    } catch (error) {
        res.status(500).send({ error: 'Error removing enrollment', details: error.message });
    }
};

const handleDeleteStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const result = await deleteStudent(studentId);
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send({ message: `Student ${studentId} deleted successfully` });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting the student' });
    }
};

export { handleGetAllStudents, handleGetStudentById, handleGetStudentDisciplines, handleGetStudentDisciplineById, handleCreateStudent, handleUpdateStudent, handleAddCompletedDiscipline, handleRemoveCompletedDiscipline, handleEnrollStudentInClass, handleRemoveStudentFromClass, handleDeleteStudent };
