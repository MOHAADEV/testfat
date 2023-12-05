import { createContext, useState, useEffect } from "react";
import socket from "../components/socket"

export const DataContext = createContext();


export const DataContexProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allMeetings, setAllMeetings] = useState([]);

    useEffect(() => {
        socket.on("allUsers", (users) => {
            setAllUsers(users);
        });
    }, []);



    useEffect(() => {
        socket.on("allMeets", (meetings) => {
            setAllMeetings(meetings);
        });
    }, []);

  return (
    <DataContext.Provider
      value={{
        allUsers,
        setAllUsers,
        allMeetings,
        setAllMeetings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}