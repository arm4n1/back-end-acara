import express, { Application, Request, Response } from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";

const app: Application = express();

async function init() {
    try {
        const result: any = await db();
        console.log("Database status:", result);

        const PORT: number = 3000;

        app.use(bodyParser.json());

        app.get("/", (req: Request, res: Response) => {
            res.status(200).json({
                message: "Server is running",
                data: null
            });
        });

        app.use('/api', router);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
}

init();
export default app; // ✅ Ekspor app untuk digunakan oleh Vercel
