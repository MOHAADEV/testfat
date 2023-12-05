import React, { useState, useEffect } from "react";
import socket from "./socket";
import { json, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JoinMeet = () => {
  const [allMeets, setAllMeets] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [meetCode, setMeetCode] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllMeets();
    getAllUsers();
  }, []);

  async function getAllMeets() {
    socket.emit("getAllMeets");
    socket.on("allMeets", (data) => {
      setAllMeets(data);
    });
  }

  async function getAllUsers() {
    socket.on("allUsers", (data) => {
      setAllUsers(data);
    });
  }

  const validate = () => {
    if (!meetCode || !userName) {
      return false;
    }

    console.log(allMeets.length);
    // make sure meet code is unique and name is unique
    for (let i = 0; i < allMeets.length; i++) {
      if (allMeets[i].meetCode === meetCode) {
        return true;
      }
    }
    return false;
  };

  // validate for user is include in array or not if not add it through socket
  const validateUser = () => {
    if (!userName) {
      return false;
    }
    // make sure meet code is unique and name is unique
    for (let i = 0; i < allusers.length; i++) {
      if (allusers[i].userName === userName) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all the fields");
      return;
    }
    const data = {
      meetCode,
      userName,
    };

    // data for user should be have meetCode and userName
    const userData = {
      meetCode,
      userName,
      date: "",
      agree: false,
    };

    if (!validateUser()) {
      socket.emit("addUser", userData);
    }
    socket.emit("joinMeet", data);
    toast.success("Meet joined successfully");
    localStorage.setItem("userName", userName);
    setMeetCode("");
    setUserName("");
    navigate(`/meet/${meetCode}`);
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      {/* title */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold">
          Join to <span className="text-[#35b198]">Meet</span>
        </h1>
      </div>
      <div className="container bg-[#fcfcfc] shadow-xl rounded-xl md:py-24 md:px-16 py-16 px-8">
        <div className="flex flex-col justify-around items-center md:flex-row gap-8">
          <div className="flex justify-center items-center gap-4 mb-6 w-full md:w-1/2">
           <p className="text-2xl font-bold">
            Now you can join to meet by enter meet code and your name
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 w-full md:w-1/2 mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <input
                type="text"
                placeholder="Enter Meet Code"
                value={meetCode}
                onChange={(e) => setMeetCode(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-lg outline-none focus:border-green-400"
              />
              <input 
                type="text"
                placeholder="Enter Your Name"
                autoComplete="new-password"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-lg outline-none focus:border-green-400"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Join Meet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeet;
