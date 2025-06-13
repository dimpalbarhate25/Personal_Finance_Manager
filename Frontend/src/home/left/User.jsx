import React from "react";

function User() {
  return (
    <div className="flex">
      <div className="flex space-x-4 px-8 py-7 hover:bg-slate-400 duration-300">
        <div className="avatar avatar-online">
          <div className="w-14 rounded-full">
            <img src="https://i.pinimg.com/originals/f5/b2/71/f5b271d7f65a0396d27d3646ca77a35b.jpg" />
          </div>
        </div>

        <div>
          <h1 className="font-bold">Gayatri dhande</h1>
          <span>Gayatri@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

export default User;
