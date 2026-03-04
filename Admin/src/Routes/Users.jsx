import axios from "axios"
import { useEffect, useState } from "react"
import {useLoaderData, useNavigate} from 'react-router-dom'
import { MdDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";

function Users() {
    const data= useLoaderData()
    const nav = useNavigate()
    
    const [users,setUsers]=useState([...data])
    const [message,setMessage]=useState('')
    const [update,setUpdate]=useState(false)
    //getAll
     const getAll = async () => {
        try {
            const response = await axios.post('http://localhost:4012/admin/get-all-user',{},{withCredentials:true})
            if (response.data.data) {
                setUsers(response.data.data)
            } else {
                setMessage(response.data.message)
                console.log(response);
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(()=>{
        getAll()
    },[update])

    

    //deleteUser
    const deleteUser=async(user)=>{
        try {
            const response = await axios.post('http://localhost:4012/admin/admin-delete/'+user._id)
            
            
            if(response.data.success){
                setUpdate(!update)
                setMessage(response.data.message)
                setTimeout(() => {
                setUpdate(false);
                  }, 2000);
            }
        } catch (error) {
            setMessage(error)
        }
    }
    return (
        <>
        <div className="w-full">
      <table className="w-full  divide-gray-200">
        <thead className="bg-gray-50">
          <tr >
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Email ID
            </th>
            <th colSpan={2} className="cols px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}  className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  
                  <button
                   onClick={()=>nav('/admin/'+user._id)}
                    className="text-gray-500 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                 <FaEye size={28}/>
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  
                  <button
                   onClick={()=>deleteUser(user)}
                    className="text-red-300 cursor-pointer hover:text-red-600 transition-colors"
                  >
                 <MdDeleteOutline size={28}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {update && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500">
          User Deleted
        </div>
      )}
        </>
    )
}

export default Users

export const getAllLoader = async () => {
    try {
        const response = await axios.post('http://localhost:4012/admin/get-all-user',{},{withCredentials:true})
        if(response.data.data)
        return response.data.data || []
    } catch (error) {
        console.log(error);        
    }
}
