import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;


const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Importing routes
import businessRouter from "./routes/business.routes";
import servicesRouter from "./routes/services.routes";
import meetingRouter from "./routes/meeting.routes";
import usersRouter from "./routes/users.routes";
import googleRoutes from "./routes/google.routes";

app.use("/api/google",googleRoutes);
app.use("/api/business", businessRouter);
app.use("/api/services", servicesRouter);
app.use("/api/meeting", meetingRouter);
app.use("/api/users", usersRouter);

async function main() {
  try {
    await mongoose.connect(MONGO_URI? MONGO_URI : "mongodb://localhost:27017/SmartBizDB");
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);

    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

main();