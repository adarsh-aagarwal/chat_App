import React from 'react'
import { useNavigate } from 'react-router-dom'

const StatusUserCard = () => {
    const navigate=useNavigate();

    const handleNavigate=()=>{
        navigate(`/status/{user}`)
    }

  return (
    <div onClick={handleNavigate}  className=' cursor-pointer p-3 flex items-center'>
      <div>
        <img  className='cursor-pointer h-7 w-7 lg:w-10 lg:h-10 rounded-full' src="https://cdn.pixabay.com/photo/2019/10/27/07/37/watermelon-4580910_640.png" alt="" />
      </div>
      <div className='text-white ml-2'>
        <p>Adarsh Agaarwal</p>
      </div>
    </div>
  )
}

export default StatusUserCard
