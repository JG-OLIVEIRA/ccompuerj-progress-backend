import { getStudentsCollection } from './connection.js';

async function createStudent({ studentId, name, lastName, completedDisciplines }) {
    try {
        const studentsCollection = getStudentsCollection();
        const studentData = {
            studentId,
            name,
            lastName,
            completedDisciplines: completedDisciplines || [],
            currentDisciplines: []
        };
        const result = await studentsCollection.insertOne(studentData);
        console.log(`Student ${studentId} inserted.`);
        return result;
    } catch (err) {
        console.error(`Error inserting student: ${err}`);
        throw err; // re-throw the error to be caught by the route handler
    }
}

async function getStudentById(studentId) {
    try {
        const studentsCollection = getStudentsCollection();
        return await studentsCollection.findOne({ studentId: studentId });
    } catch (err) {
        console.error(`Error fetching student ${studentId}: ${err}\n`);
        return null;
    }
}

// Fetch all students
async function getAllStudents() {
    try {
        const studentsCollection = getStudentsCollection();
        return await studentsCollection.find({}).toArray();
    } catch (err) {
        console.error(`Error fetching students: ${err}\n`);
        return [];
    }
}

async function updateStudent({ studentId, name, lastName }) {
    try {
        const studentsCollection = getStudentsCollection();
        const updates = {};
        if (name) updates.name = name;
        if (lastName) updates.lastName = lastName;

        const result = await studentsCollection.updateOne(
            { studentId: studentId },
            { $set: updates }
        );
        console.log(`Student ${studentId} updated.`);
        return result;
    } catch (err) {
        console.error(`Error updating student: ${err}`);
        throw err;
    }
}

async function updateCompletedDisciplines({ studentId, add, remove }) {
    try {
        const studentsCollection = getStudentsCollection();
        if ((!add || add.length === 0) && (!remove || remove.length === 0)) {
            console.log(`No changes for student ${studentId}`);
            return { matchedCount: 1, modifiedCount: 0 };
        }

        const allDisciplineIds = (add || []).concat(remove || []);
        const invalidIds = allDisciplineIds.filter(id => typeof id !== 'string' || !/^[\w-]+$/.test(id));

        if (invalidIds.length > 0) {
            throw new Error(`Invalid discipline IDs: ${invalidIds.join(', ')}`);
        }

        let disciplinesExpr = { $ifNull: ["$completedDisciplines", []] };

        if (add && add.length > 0) {
            disciplinesExpr = { $setUnion: [disciplinesExpr, add] };
        }

        if (remove && remove.length > 0) {
            disciplinesExpr = {
                $filter: {
                    input: disciplinesExpr,
                    as: "discipline",
                    cond: { $not: { $in: ["$$discipline", remove] } }
                }
            };
        }

        const updatePipeline = [{ $set: { completedDisciplines: disciplinesExpr } }];

        const result = await studentsCollection.updateOne(
            { studentId: studentId },
            updatePipeline
        );
        console.log(`Student ${studentId} updated.`);
        return result;
    } catch (err) {
        console.error(`Error updating student: ${err}`);
        throw err;
    }
}

async function updateCurrentDisciplines({ studentId, disciplineId, classNumber, action }) {
    try {
        const studentsCollection = getStudentsCollection();
        const classEnrollment = {
            disciplineId: disciplineId,
            classNumber: parseInt(classNumber, 10)
        };

        const updateQuery = action === 'add'
            ? { $addToSet: { currentDisciplines: classEnrollment } } // Use $addToSet to prevent duplicates
            : { $pull: { currentDisciplines: classEnrollment } }; // Use $pull to remove the specific object

        const result = await studentsCollection.updateOne(
            { studentId: studentId },
            updateQuery
        );
        
        const actionText = action === 'add' ? 'added' : 'removed';
        console.log(`Enrollment for Student ${studentId} in Discipline ${disciplineId}, Class ${classNumber} ${actionText}.`);
        return result;
    } catch (err) {
        console.error(`Error updating current disciplines: ${err}`);
        throw err;
    }
}

async function deleteStudent(studentId) {
    try {
        const studentsCollection = getStudentsCollection();
        const result = await studentsCollection.deleteOne({ studentId: studentId });
        console.log(`Student ${studentId} deleted.`);
        return result;
    } catch (err) {
        console.error(`Error deleting student: ${err}`);
        throw err;
    }
}

export { createStudent, getStudentById, getAllStudents, updateStudent, updateCompletedDisciplines, updateCurrentDisciplines, deleteStudent };
