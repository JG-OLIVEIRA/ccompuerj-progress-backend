import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UERJ Scraping API',
            version: '1.0.0',
        },
        tags: [
            {
                name: 'Teachers',
                description: 'Endpoints for retrieving teacher information'
            }
        ],
        components: {
            schemas: {
                Teacher: {
                    type: 'object',
                    properties: {
                        teacherId: {
                            type: 'string',
                            description: "The teacher\'s unique ID.",
                            example: 'T0001'
                        },
                        name: {
                            type: 'string',
                            description: "The teacher's name.",
                            example: 'FULANO DE TAL'
                        },
                        disciplines: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'A list of discipline IDs that the teacher teaches.',
                            example: ['11440', '11441']
                        }
                    }
                },
                Student: {
                    type: 'object',
                    properties: {
                        studentId: {
                            type: 'string',
                            description: "The student's ID.",
                            example: '20201010101'
                        },
                        name: {
                            type: 'string',
                            description: "The student's name.",
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            description: "The student's last name.",
                            example: 'Doe'
                        },
                        completedDisciplines: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'A list of discipline IDs that the student has completed.',
                            example: ['DC001', 'DC002']
                        },
                        currentDisciplines: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'A list of discipline IDs that the student is currently taking.',
                            example: ['DC003', 'DC004']
                        }
                    }
                },
                Discipline: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        period: { type: 'string' },
                        type: { type: 'string' },
                        ramification: { type: 'string' },
                        credits: { type: 'string' },
                        totalHours: { type: 'string' },
                        creditLock: { type: 'string' },
                        classInPeriod: { type: 'string' },
                        disciplineId: { type: 'string' },
                        requirements: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Requirement'
                            }
                        },
                        classes: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Class'
                            }
                        }
                    }
                },
                Requirement: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        description: { type: 'string' }
                    }
                },
                Class: {
                    type: 'object',
                    properties: {
                        number: { type: 'string' },
                        preferential: { type: 'string' },
                        times: { type: 'string' },
                        teacher: { type: 'string' },
                        offeredUerj: { type: 'string' },
                        occupiedUerj: { type: 'string' },
                        offeredVestibular: { type: 'string' },
                        occupiedVestibular: { type: 'string' },
                        requestUerjOffered: { type: 'string' },
                        requestUerjTotal: { type: 'string' },
                        requestUerjPreferential: { type: 'string' },
                        requestVestibularOffered: { type: 'string' },
                        requestVestibularTotal: { type: 'string' },
                        requestVestibularPreferential: { type: 'string' },
                        whatsappGroup: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
