import express from "express";
import { google } from "googleapis";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";

const app = express();

// Load env variables
dotenv.config();


// cors middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

const auth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const calendar = google.calendar({ version: "v3", auth: auth2Client });

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a server
const server = http.createServer(app);

// port for server
const PORT = process.env.PORT || 5000;

// Create an array to store meeting data
const meetings = [];

// Create a user array to store user data
const users = [];

let meetcode = "";
let description = "";
let date = "";

app.post("/google", (req, res) => {
  meetcode = req.body.meetcode;
  description = req.body.description;
  date = req.body.date;
  const url = auth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.send(url);
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;

  const { tokens } = await auth2Client.getToken(code);

  auth2Client.setCredentials(tokens);

  // redierct to create endpoint
  res.redirect("/create");
});

app.get("/create", async (req, res) => {
  // set static data
  const summary = "Meeting";

  calendar.events.insert(
    {
      auth: auth2Client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: description,
        start: {
          dateTime: dayjs(date).add(1, "day").toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: dayjs(date).add(1, "day").add(1, "hour").toISOString(),
          timeZone: "Asia/Kolkata",
        },
      },
    },
    (err, event) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
      console.log("Event created: %s", event);
    }
  );

  // redirect to frontend localhost:3000 and send a status code
  res.status(200).redirect(`http://localhost:3000/meet/${meetcode}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("makeMeet", (data) => {
    // Store meeting data in the array
    meetings.push(data);
    console.log("Meetings Array:", meetings);
    socket.emit("allMeets", meetings);
  });

  // Store user data in the array
  socket.on("addUser", (data) => {
    users.push(data);
    console.log("Users Array:", users);
  });

  // send meeting data to frontend
  socket.on("getAllMeets", () => {
    socket.emit("allMeets", meetings);
  });
  socket.emit("allMeets", meetings);

  // join meeting
  socket.on("joinMeet", (data) => {
    socket.emit("allMeets", meetings);
  });

  // send user data to frontend
  socket.on("getAllUsers", () => {
    socket.emit("allUsers", users);
  });
  socket.emit("allUsers", users);

  // put date for user
  socket.on("putDate", (data) => {
    users.forEach((user) => {
      if (user.userName === data.userName) {
        user.date = data.date;
        user.agree = data.agree;
      }
    });
    console.log("Users Array:", users);
    socket.emit("allUsers", users);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.listen(8000, () => {
  console.log(`Listening on port ${8000}`);
});
