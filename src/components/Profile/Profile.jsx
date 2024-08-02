import React, { useState } from "react";
import {
  BsArrowDownLeft,
  BsArrowLeft,
  BsCheck2,
  BsPencil,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Profile = ({handleCloseOpenProfile,isusr}) => {

  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [username,setUsername]=useState(null);

  

  const HandleCheckClick = () => {
    setFlag(false);
  };

  const HandleClick = () => {
    setFlag(true);
  };

  const handleChange=(e)=>{
    setUsername(e.target.value)
  }

  return (
    <div className="w-full h-full ">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          className="cursor-pointer text-2xl font-bold"
          onClick={handleCloseOpenProfile}
        />
        <p className="cursor-pointer font-bold">Profile</p>
      </div>

      {/* update profile pic section */}
      <div className="flex flex-col items-center my-12 justify-center">
        <label htmlFor="imgInput">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
            src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
            alt=""
          />
        </label>

        <input type="file" id="imgInput" className="hidden" />
      </div>

      {/* name section */}
      <div className=" bg-white px-3">
        <p className="py-3 ">{isusr}</p>
        
        {!flag && (
            <div className="justify-between items-center w-full  flex">
                <p className="py-3">{isusr ||"username"}</p>
              <BsPencil onClick={HandleClick} className="cursor-pointer" />
            </div>
          
        )}

        {flag && (
          <div className="flex w-full justify-between items-center py-2">
            <input
              onChange={handleChange}
              className="outline-none w-[80%] border-b-2 p-2 "
              type="text"
              placeholder="Enter the name you want to be displayed"
            />
            <BsCheck2
              className="cursor-pointer text-2xl"
              onClick={HandleCheckClick}
              
            />
          </div>
        )}

        <div className="px-3 my-5">
          <p className="py-10">this name will be visible to your contacts</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
