import { MongoClient } from "mongodb";
import 'dotenv/config';

const dbName = "uerjScrapingDatabase";
const disciplinesCollectionName = "disciplines";
const studentsCollectionName = "students";
const teachersCollectionName = "teachers";

const client = new MongoClient(process.env.MONGODB_URL);

let disciplinesCollection;
let studentsCollection;
let teachersCollection;

// Initializes MongoDB on startup
async function initMongo() {
    await client.connect();
    const db = client.db(dbName);
    disciplinesCollection = db.collection(disciplinesCollectionName);
    studentsCollection = db.collection(studentsCollectionName);
    teachersCollection = db.collection(teachersCollectionName);
    console.log("✅ MongoDB connected");
}

function getDisciplinesCollection() {
    return disciplinesCollection;
}

function getStudentsCollection() {
    return studentsCollection;
}

function getTeachersCollection() {
    return teachersCollection;
}

export { initMongo, getDisciplinesCollection, getStudentsCollection, getTeachersCollection };
