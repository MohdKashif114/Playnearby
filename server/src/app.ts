import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import http from "http"
import {Server} from "socket.io"
import { setupPresence } from "./sockets/connections";
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser"
import mainpageauthRoute from "./routes/mainpageauthRoute"
import fetchRoutes from "./routes/fetchRoutes"
import messageRoute from "./routes/messageRoute"
import { instrument } from "@socket.io/admin-ui";
import setlocationRoute from "./routes/setlocationRoute"


dns.setServers(["1.1.1.1"]);
dotenv.config();

import connectDB from "./config/db";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/authRoutes"

const app = express();
const server=http.createServer(app);
connectDB();

//socket io needs a raw http server to connect
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://admin.socket.io",
    ],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

instrument(io, {
  auth: false, // dev only
});

setupPresence(io);
app.use(cors({
  origin: ["http://localhost:5173",
    "https://admin.socket.io"],
    credentials: true
  }));





  
  


app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use(mainpageauthRoute)
app.use(fetchRoutes);
app.use("/messages",messageRoute);
app.use(setlocationRoute)




app.get("/", (req, res) => {
  res.send("PlayNearby API is running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
