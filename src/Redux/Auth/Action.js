import { type } from "@testing-library/user-event/dist/type";
import { BASE_API_URL } from "../../config/api"
import { LOGIN,LOGOUT,REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";

 export const register=(data)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/auth/signup`,{
            method:"POST",
            headers:{
                "Content-Type":"application/Json",
            },
            body:JSON.stringify(data)
        })
        const resData=await res.json();
        if(resData.token){
            localStorage.setItem("token",resData.token)
        }
        console.log("register",resData);
        dispatch({type:REGISTER,payload:resData})
    } catch (error) {
        console.log("error at register",error);
    }
}

export const login=(data)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/auth/signin`,{
            method:"POST",
            headers:{
                "Content-Type":"application/Json",
            },
            body:JSON.stringify(data)
        })
        const resData=await res.json()
        if(resData.token){
           localStorage.setItem("token",resData.token)
        }
        console.log("login",resData);
        dispatch({type:LOGIN,payload:resData})
    } catch (error) {
        console.log("error at login",error);
    }
}

export const currentUser=(token)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/users/profile`,{
            method:"GET",
            headers:{
                "Content-Type":"application/Json",
                Authorization:`Bearer ${token}`
            },
            
        })
        const resData=await res.json()
        
        // console.log("current user",resData);
        dispatch({type:REQ_USER,payload:resData})
    } catch (error) {
        console.log("error at currentuser",error);
    }
}

export const searchUser=(data)=>async(dispatch)=>{
    
    try {
        const res=await fetch(`${BASE_API_URL}/users?search=${data.keyword}`,{
            method:"GET",
            headers:{
                "content-Type":"application/Json",
                Authorization:`Bearer ${data.token}`
            },
            
        })
        const resData=await res.json()
        // console.log("search",resData);
        dispatch({type:SEARCH_USER,payload:resData})
    } catch (error) {
        console.log("error at currentuser",error);
    }
}

export const updateUser=(data)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/users/update/${data.id}`,{
            method:"GET",
            headers:{
                "content-Type":"application/Json",
                Authorization:`Bearer ${data.token}`
            },
            
        })
        const resData=await res.json()
        console.log("register",resData);
        dispatch({type:UPDATE_USER,payload:resData})
    } catch (error) {
        console.log("error at currentuser",error);
    }
}

export const handleLogout=()=>async(dispatch)=>{
    localStorage.removeItem("token")
    dispatch({type:LOGOUT,payload:null})
    dispatch({type:REQ_USER,payload:null})
}


