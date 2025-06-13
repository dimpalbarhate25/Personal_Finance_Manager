import React from "react";
import { IoIosSend } from "react-icons/io";

function Type() {
  return (
    <>
      <div className="flex space-x-3 h-[8vh] text-center bg-gray-700 ">
        <div className="w-[70%]">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered border-gray-700 w-full max-w-xs grow outline-none bg-slate-900 mt-1 rounded-lg items-center rounded-xl"
          />
        </div>

        <button className="text-3xl">
          <IoIosSend />
        </button>
      </div>
    </>
  );
}

export default Type;
