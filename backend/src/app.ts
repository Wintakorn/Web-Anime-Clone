import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors({
    // origin: ['http://localhost:5173', 'http://192.168.1.74:5173','https://react-build-tests.netlify.app','https://2253-182-53-49-252.ngrok-free.app'],
    origin: true,
    credentials: true,
}));

// const allowedOrigins = ['https://react-build-tests.netlify.app'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true // ✅ ต้องเป็น true ถ้า frontend ใช้ withCredentials
// }));


import userRoutes from "./routes/user.Routes"
import mangaRoutes from "./routes/manga.routes";
import cartRoutes from "./routes/cart.routes"
import reviewRoutes from "./routes/review.routes";
import postRoutes from "./routes/post.routes"
import commentRoutes from "./routes/comment.routes"
import replyRoutes from "./routes/reply.routes"

app.use("/api", userRoutes)
app.use("/api", mangaRoutes)
app.use("/api", cartRoutes)
app.use("/api", reviewRoutes)
app.use("/api", postRoutes)
app.use("/api", commentRoutes)
app.use("/api", replyRoutes)

mongoose.connect(process.env.MONGODB_URI || "")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


export default app;