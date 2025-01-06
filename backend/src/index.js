import express from 'express';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import dotenv  from 'dotenv';
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { app, server } from './lib/socket.js';
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT  = process.env.PORT;

app.use(cors({
    origin : "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials : true,

}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
    console.log('Server is running on port:'+PORT);
    connectDb();
})