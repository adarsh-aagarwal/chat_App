import { Alert, AlertTitle, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, register,reqUser } from "../../Redux/Auth/Action";
import { store } from "../../Redux/store";

const Signup = () => {
  const [inputData, setInputData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch=useDispatch();
  const {auth}=useSelector(store=>store)
  const token=localStorage.getItem("token")




  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("input",inputData);
    dispatch(register(inputData))
    setOpenSnackbar(true);
  };

  const handleChange = (e) => {
    const {name,value}=e.target;
    setInputData((values)=>({...values,[name]:value}))
  };

  useEffect(()=>{
        if(token) {
          dispatch(currentUser(token))
        }
  },[token])

  useEffect(()=>{
    if(auth.reqUser?.userName){

      navigate("/")
    } 
},[auth.reqUser])

  return (
    <div>
      <div>
        <div className="flex flex-col justify-center min-h-screen items-center">
          <div className="p-10 w-[30%] shadow-md bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                    <p className="mb-2">User Name</p>
                    <input
                         type="text"
                        className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
                     placeholder="Enter Username"
                     name="userName"
                    onChange={(e)=> handleChange(e)}
                    value={inputData.userName}
                    />
              </div>

              <div>
                <p className="mb-2">Email</p>
                <input
                  type="text"
                  className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
                  placeholder="Enter your Email"
                  name="email"
                  onChange={(e)=> handleChange(e)}
                  value={inputData.email}
                />
              </div>

              <div>
                <p className="mb-2">Password</p>
                <input
                  type="password"
                  className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
                  placeholder="Enter your password"
                  name="password"
                  onChange={(e)=> handleChange(e)}
                  value={inputData.password }
                />
              </div>
                
              <div>
              <Button
                type="submit"
                className="w-full"
                sx={{ bgcolor:green, padding: ".5rem 0rem" }}
                variant="contained "
              >
                Signup
              </Button>
            </div>
         </form>
         <div className="flex space-x-3 items-center mt-5">
            <p className="">Already have an Account?</p>
            <Button
              Variant="text"
              sx={{ color: "black" }}
              onClick={() => navigate("/signin")}
            >
              Signin
            </Button>  
         </div>
          </div>
        </div>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >Sucessfuly Created Account </Alert>
      </Snackbar>
      </div>
    </div>
  );
};

export default Signup;
