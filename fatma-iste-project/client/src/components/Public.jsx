import React from "react";
import publicImage from "../assets/public.jpg";
import { Link } from "react-router-dom";

const Public = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white w-full">
      {/* title */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <h1 className="text-4xl text-center font-bold">
          Welcome to <span className="text-[#35b198]">Meet</span> App
        </h1>
      </div>
      <div className="container bg-[#fcfcfc] shadow-xl rounded-lg md:py-24 md:px-16 py-16 px-8">
        <div className="flex flex-col-reverse justify-around items-center md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            {/* summery of meet app */}
            <h1 className="text-3xl font-bold mb-8">
              Now you can make your own meet and join other meets
            </h1>
            <div className="flex justify-center items-center gap-4">
              <Link to="/joinmeet">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Join Meet
                </button>
              </Link>
              <Link to="/makemeet">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Make Meet
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <img src={publicImage} alt="public" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Public;
