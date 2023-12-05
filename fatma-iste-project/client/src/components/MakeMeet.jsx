import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import toast from "react-hot-toast";

const MakeMeet = () => {
  const [allMeets, setAllMeets] = useState([]);
  const [meetName, setMeetName] = useState("");
  const [meetCode, setMeetCode] = useState("");
  const [meetDate, setMeetDate] = useState("");
  const [meetDescription, setMeetDescription] = useState("");

  const navigate = useNavigate();

  // get all meets
  useEffect(() => {
    getAllMeets();
  }, []);

  async function getAllMeets() {
    socket.on("allMeets", (data) => {
      setAllMeets(data);
    });
  }

  const validate = () => {
    if (!meetName || !meetCode || !meetDate || !meetDescription) {
      return false;
    }
    // make sure meet code is unique and name is unique
    for (let i = 0; i < allMeets.length; i++) {
      if (
        allMeets[i].meetCode === meetCode ||
        allMeets[i].meetName === meetName
      ) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all the fields");
      return;
    }
    const data = {
      meetName,
      meetCode,
      meetDate,
      meetDescription,
    };
    socket.emit("makeMeet", data);
    toast.success("Meet created successfully");
    setMeetName("");
    setMeetCode("");
    setMeetDate("");
    navigate("/joinmeet");
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      {/* title */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold">
          Make <span className="text-[#35b198]">Meet</span>
        </h1>
      </div>
      <div className="container bg-[#fcfcfc] shadow-xl rounded-xl md:py-20 md:px-12 py-16 px-8 w-full">
        <div className="flex flex-col justify-around items-center md:flex-row gap-8 w-full">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-4">
            <p className="text-2xl font-bold">
              Make a new meet and share it with your friends
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 w-full md:w-1/2">
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Meet Name"
                className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
                onChange={(e) => setMeetName(e.target.value)}
              />
              <input 
                type="text"
                placeholder="Meet Description"
                className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
                onChange={(e) => setMeetDescription(e.target.value)}
              />
              <input
                type="date"
                placeholder="Meet Date"
                className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
                onChange={(e) => setMeetDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Meet Code"
                className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
                disabled
                value={meetCode}
                onChange={(e) => setMeetCode(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>
                  setMeetCode(
                    Math.random().toString(36).substring(2, 7).toUpperCase()
                  )
                }
              >
                Generate Code
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Make Meet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeMeet;
