import React, { useState, useEffect } from "react";
import socket from "./socket";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { MdOutlineVerified } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";

const Meet = () => {
  const [allMeets, setAllMeets] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [meetDate, setMeetDate] = useState("");
  const { meetcode } = useParams();

  const canAgree = () => {
    for (let i = 0; i < allusers.length; i++) {
      if (
        allusers[i].userName === localStorage.getItem("userName") &&
        allusers[i].agree === true
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    getAllMeets();
    getAllUsers();
  }, []);

  async function getAllMeets() {
    socket.on("allMeets", (data) => {
      setAllMeets(data.filter((meet) => meet.meetCode === meetcode));
    });
  }

  async function getAllUsers() {
    socket.emit("getAllUsers", (data) => {
      console.log(data);
    });
    socket.on("allUsers", (data) => {
      setAllUsers(
        data.filter((user) => user.meetCode === meetcode && user.agree === true)
      );
    });
  }

  const handleChangeDateForUser = () => {
    const data = {
      meetcode,
      userName: localStorage.getItem("userName") || "",
      date: meetDate,
      agree: true,
    };

    // check if user agree or not
    if (canAgree()) {
      toast.error("You can't change date before agree for meet");
      return;
    }

    // check if meet date is empty or not
    if (!meetDate) {
      toast.error("Please fill all the fields");
      return;
    }

    socket.emit("putDate", data);
    getAllUsers();
    toast.success("Date changed successfully");
  };

  const handleAgreeForUser = () => {
    const data = {
      meetcode,
      userName: localStorage.getItem("userName") || "",
      date: allMeets[0].meetDate,
      agree: true,
    };

    // check if user agree or not
    if (canAgree()) {
      toast.error("You can't agree or change date again after agree");
      return;
    }
    socket.emit("putDate", data);
    getAllUsers();
    toast.success("Agree successfully");
  };

  const handleInsertToGoogleCalendar = async () => {
    // // check if user agree or not
    if (!canAgree()) {
      toast.error("You can't add to google calendar before agree");
      return;
    }

    const res = await axios.post("http://localhost:8000/google", {
      meetcode,
      description: allMeets[0]?.meetDescription || "",
      date: new Date(),
    });
    const url = res.data;

    // change url to be able to open in same tab
    const newUrl = url.replace("target=_blank", "target=_self");
    window.open(newUrl, "_self");
  };

  // display all meet details and create a buttom for agree for data meet and create a button for change a new meet date , also create a tavle for all users in this meet
  return (
    <div className="h-screen flex justify-center items-center bg-white">
      {/* container for meet details */}
      <div className="container">
        {/* display a cuurent user name from local storage */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">
            Hoşgeldin,{" "}
            <span className="text-[#35b198]">
              {localStorage.getItem("userName")}
            </span>
          </h1>
        </div>
        <div className="flex justify-center items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Meet Details</h1>
        </div>
        {/* display all meet details */}
        {allMeets?.map((meet, index) => {
          return (
            <div className="block w-full overflow-x-auto" key={index}>
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Meet Name
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Meet Description
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Meet Code
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Meet Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="" key={index}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {meet.meetName}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {meet.meetDescription}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {meet.meetCode}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {meet.meetDate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}

        {/* create a button for agree for data meet */}
        <div className="flex flex-col justify-center items-center gap-4 mt-4 mb-6">
          <div className="flex justify-center items-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-[150px]"
              onClick={handleAgreeForUser}
              disabled={canAgree()}
            >
              Agree
            </button>
          </div>
          {/* create a button for change a new meet date */}
          <div className="flex justify-center items-center gap-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleChangeDateForUser}
              disabled={canAgree()}
            >
              Change Date
            </button>
            <input
              type="date"
              placeholder="Meet Date"
              className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
              onChange={(e) => setMeetDate(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-center gap-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleInsertToGoogleCalendar}
              disabled={!canAgree()}
            >
              Insert To Google Calendar <FaGoogle className="inline-block" />
            </button>
          </div>
        </div>
        {/* create a table for all users in this meet */}
        <div className="p-6 bg-[#f7f7f7b6] rounded-xl shadow-xl">
          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    User Name
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Agree
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Date
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-s uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Meet Code
                  </th>
                </tr>
              </thead>

              <tbody>
                {allusers && allusers.length === 0 && (
                  <tr className="text-center">
                    <td className="px-6 py-4 text-center w-1/2" colSpan="4">
                      No Users Found in this meet
                    </td>
                  </tr>
                )}
                {allusers?.map((user, index) => {
                  return (
                    <tr className="" key={index}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {user.userName}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {user.agree === true ? (
                          <MdOutlineVerified className="text-green-500" />
                        ) : (
                          <VscError className="text-red-500" />
                        )}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {user.date}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {user.meetCode}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meet;
