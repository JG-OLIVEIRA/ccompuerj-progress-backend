import { getDisciplinesCollection } from './connection.js';

// Refined upsert: only updates fields that have changed
async function upsertDiscipline(discipline) {
    try {
        const disciplinesCollection = getDisciplinesCollection();
        const existing = await disciplinesCollection.findOne({ disciplineId: discipline.disciplineId });

        if (existing) {
            const newClasses = discipline.classes || [];
            const existingClasses = existing.classes || [];

            // Preserve whatsappGroup links from existing classes
            if (existingClasses.length > 0) {
                const existingClassMap = new Map(existingClasses.map(c => [c.number, c]));
                for (const newClass of newClasses) {
                    const existingClass = existingClassMap.get(newClass.number);
                    if (existingClass && existingClass.whatsappGroup) {
                        newClass.whatsappGroup = existingClass.whatsappGroup;
                    }
                }
            }
            
            const updatedDiscipline = { ...discipline, classes: newClasses };
            const updates = {};
            for (const key in updatedDiscipline) {
                if (key === '_id') continue; // Do not compare or update the _id field
                if (JSON.stringify(updatedDiscipline[key]) !== JSON.stringify(existing[key])) {
                    updates[key] = updatedDiscipline[key];
                }
            }

            if (Object.keys(updates).length > 0) {
                await disciplinesCollection.updateOne(
                    { disciplineId: discipline.disciplineId },
                    { $set: updates }
                );
                console.log(`${discipline.name} updated with modified fields:`, Object.keys(updates));
            } else {
                console.log(`${discipline.name} had no changes.`);
            }
        } else {
            await disciplinesCollection.insertOne(discipline);
            console.log(`${discipline.name} inserted.`);
        }
    } catch (err) {
        console.error(`Error inserting/updating discipline: ${err}`);
    }
}

// Fetch all disciplines
async function getAllDisciplines() {
    try {
        const disciplinesCollection = getDisciplinesCollection();
        return await disciplinesCollection.find({}).toArray();
    } catch (err) {
        console.error(`Error fetching disciplines: ${err}\n`);
        return [];
    }
}

// Fetch discipline by id
async function getDisciplineById(id) {
    try {
        const disciplinesCollection = getDisciplinesCollection();
        return await disciplinesCollection.findOne({ disciplineId: id });
    } catch (err) {
        console.error(`Error fetching discipline ${id}: ${err}\n`);
        return null;
    }
}

async function updateWhatsappGroup({ disciplineId, classNumber, whatsappGroup }) {
    try {
        const disciplinesCollection = getDisciplinesCollection();
        const result = await disciplinesCollection.updateOne(
            { disciplineId: disciplineId, "classes.number": parseInt(classNumber, 10) },
            { $set: { "classes.$.whatsappGroup": whatsappGroup } }
        );
        console.log(`Discipline ${disciplineId}, Class ${classNumber} updated with new WhatsApp group.`);
        return result;
    } catch (err) {
        console.error(`Error updating WhatsApp group: ${err}`);
        throw err;
    }
}

export { upsertDiscipline, getAllDisciplines, getDisciplineById, updateWhatsappGroup };
