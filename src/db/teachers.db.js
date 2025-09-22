import { getTeachersCollection } from './connection.js';

// Upsert a teacher by name
async function upsertTeacher(teacherName) {
    try {
        const teachersCollection = getTeachersCollection();
        const existingTeacher = await teachersCollection.findOne({ name: teacherName });
        if (!existingTeacher) {
            const teacherId = `T${String(await teachersCollection.countDocuments() + 1).padStart(4, '0')}`;
            await teachersCollection.insertOne({ name: teacherName, teacherId });
            console.log(`Teacher '${teacherName}' inserted with ID ${teacherId}.`);
        }
    } catch (err) {
        console.error(`Error upserting teacher: ${err}`);
    }
}

// Fetch all teachers and the disciplines they teach
async function getAllTeachers() {
    try {
        const teachersCollection = getTeachersCollection();
        const pipeline = [
            // Start with the teachers collection
            { $sort: { name: 1 } },

            // Lookup disciplines for each teacher
            {
                $lookup: {
                    from: "disciplines",
                    let: { teacherName: "$name" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$$teacherName", "$classes.teacher"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                disciplineId: 1
                            }
                        }
                    ],
                    as: "taughtDisciplines"
                }
            },

            // Project the final structure
            {
                $project: {
                    _id: 0,
                    teacherId: 1,
                    name: 1,
                    disciplines: "$taughtDisciplines.disciplineId"
                }
            }
        ];

        return await teachersCollection.aggregate(pipeline).toArray();
    } catch (err) {
        console.error(`Error fetching teachers with disciplines: ${err}\n`);
        return [];
    }
}

export { upsertTeacher, getAllTeachers };
