import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API ACARA",
        description: "Dokumentasi API"
    },

    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
        {
            url: "https://back-end-acara-alpha.vercel.app/api",
            description: "Vercel Server",
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },

        schemas: {
            loginRequest: {
                type: "object",
                properties: {
                    identifier: { type: "string", example: "mulyadiarman" },
                    password: { type: "string", example: "password" },
                },
                required: ["identifier", "password"],
            },

            // Tambahkan skema User untuk menghindari error
            User: {
                type: "object",
                properties: {
                    _id: { type: "string", example: "65a2b8d9f4b1a8a3c1234567" },
                    fullName: { type: "string", example: "John Doe" },
                    username: { type: "string", example: "johndoe" },
                    email: { type: "string", example: "johndoe@example.com" },
                    role: { type: "string", example: "user" },
                    createdAt: { type: "string", format: "date-time", example: "2024-01-01T12:00:00Z" },
                    updatedAt: { type: "string", format: "date-time", example: "2024-01-02T12:00:00Z" },
                },
            },
        },
    }
};

const outputFile = "./swagger_output.json";  // perbaikan typo dari 'outpotFile'
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
