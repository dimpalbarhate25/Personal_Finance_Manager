import React from "react";

function Chatuser() {
  return (
    <>
      <div className="pl-5 pt-5 pb-3 m-5 h-[12vh] flex space-x-4 bg-grey-900 hover:bg-gray-600 duration-300">
        <div>
          <div className="avatar avatar-online">
            <div className="w-14 rounded-full">
              <img src="https://i.pinimg.com/originals/f5/b2/71/f5b271d7f65a0396d27d3646ca77a35b.jpg" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-xl">Gyatri dhande</h1>
          <span className="text-sm">Online</span>
        </div>
      </div>
    </>
  );
}

export default Chatuser;
