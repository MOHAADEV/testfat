// App.js

import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import socket from "./components/socket";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Meet from "./components/Meet";
import JoinMeet from "./components/JoinMeet";
import MakeMeet from "./components/MakeMeet";

function App() {
  useEffect(() => {
    // Connect to the server
    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
      </Route>
      <Route path="/meet/:meetcode" element={<Meet />} />
      <Route path="/joinmeet" element={<JoinMeet />} />
      <Route path="/makemeet" element={<MakeMeet />} />
    </Routes>
  );
}

export default App;
