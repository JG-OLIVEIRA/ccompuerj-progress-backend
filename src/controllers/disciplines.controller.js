import { getAllDisciplines, getDisciplineById, updateWhatsappGroup } from '../db/disciplines.db.js';
import { scrapeDisciplines, scrapeWhatsappLinks } from '../scraping/scraper.js';
import 'dotenv/config';

const handleGetAllDisciplines = async (req, res) => {
    const disciplines = await getAllDisciplines();
    res.send(disciplines);
};

const handleGetDisciplineById = async (req, res) => {
    const discipline = await getDisciplineById(req.params.id);
    if (discipline) {
        res.send(discipline);
    } else {
        res.status(404).send({ error: 'Discipline not found' });
    }
};

const handleGetClassInDiscipline = async (req, res) => {
    const { id, classNumber } = req.params;
    const discipline = await getDisciplineById(id);

    if (!discipline) {
        return res.status(404).send({ error: 'Discipline not found' });
    }

    const classInfo = discipline.classes.find(c => String(c.number) === classNumber);

    if (!classInfo) {
        return res.status(404).send({ error: 'Class not found' });
    }

    res.send(classInfo);
};

const handleScrapeDisciplines = async (req, res) => {
    // Fire and forget: start the process but don't wait for it to finish
    scrapeDisciplines(process.env.UERJ_LOGIN, process.env.UERJ_PASSWORD);
    res.status(202).send({ message: 'Discipline scraping process started.' });
};

const handleScrapeWhatsappLinks = async (req, res) => {
    // Fire and forget: start the process but don't wait for it to finish
    scrapeWhatsappLinks();
    res.status(202).send({ message: 'WhatsApp link scraping process started.' });
};

const handleUpdateWhatsappGroup = async (req, res) => {
    const { id, classNumber } = req.params;
    const { whatsappGroup } = req.body;

    try {
        const result = await updateWhatsappGroup({ disciplineId: id, classNumber, whatsappGroup });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Discipline or class not found' });
        }
        res.status(200).send({ message: `WhatsApp group for class ${classNumber} updated successfully` });
    } catch (error) {
        res.status(500).send({ error: 'Error updating the WhatsApp group' });
    }
};

export { handleGetAllDisciplines, handleGetDisciplineById, handleGetClassInDiscipline, handleScrapeDisciplines, handleScrapeWhatsappLinks, handleUpdateWhatsappGroup };
