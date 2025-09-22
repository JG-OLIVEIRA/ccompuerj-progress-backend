import { getAllTeachers } from '../db/teachers.db.js';

const handleGetAllTeachers = async (req, res) => {
    try {
        const teachers = await getAllTeachers();
        res.status(200).send(teachers);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving teachers' });
    }
};

export { handleGetAllTeachers };
