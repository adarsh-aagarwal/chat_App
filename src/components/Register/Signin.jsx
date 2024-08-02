

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, Button } from "@mui/material";
import { green } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, login } from "../../Redux/Auth/Action";


const Signin = () => {
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const token=localStorage.getItem("token")
const {auth}=useSelector(store=>store)

   console.log(token);
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handlesubmit");
    dispatch(login(inputData));
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    if (token){ 
      dispatch(currentUser(token));
    }
  }, [token]);

  useEffect(() => {
    if (auth.reqUser?.userName) {
      navigate("/")
    }
  }, [auth.reqUser]);

  return (
    <div className="">
      <div className="justify-center flex h-screen items-center">
        <div className="w-[30%] p-10 shadow-md bg-white rounded-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="mb-2">Email</p>
              <input
                type="email" // Changed to "email"
                placeholder="Enter your Email"
                className="py-2 outline-green-400 w-full rounded-md border"
                name="email" // Added name attribute
                onChange={handleChange}
                value={inputData.email}
              />
            </div>

            <div>
              <p className="mb-2">Password</p>
              <input
                type="password" // Changed to "password"
                placeholder="Enter your password"
                className="py-2 outline-green-400 w-full rounded-md border"
                name="password" // Added name attribute
                onChange={handleChange}
                value={inputData.password}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                variant="contained"
              >
                Signin
              </Button>
            </div>
          </form>
          <div className="flex space-x-3 items-center mt-5">
            <p className="m-0">Create New Account</p>
            <Button
              variant="text" // Corrected "Variant" to "variant"
              sx={{ color: "black" }}
              onClick={() => navigate("/signup")}
            >
              Signup
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
        >
          Successfully Logged In
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signin;


