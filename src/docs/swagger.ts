import swaggerAutogen from "swagger-autogen";


const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API ACARA",
        description: "Dokumentasi API"
    },
    
    server: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },

        {
            url: "https://back-end-acara-alpha.vercel.app/api",
            description: "Vercel Server",
        }
    ],

    components: {
        securitySchemas: {
            bearerAuth: {
                type: "http",
                schema: "bearer",
            },
        },

        schemas: {
            loginRequest: {
                identifier: "mulyadiarman",
                password: "password"
            },
        },
    }
}
const outpotFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outpotFile, endpointsFiles, doc)