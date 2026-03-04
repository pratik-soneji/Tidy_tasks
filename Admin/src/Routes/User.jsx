
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function User() {
    const {id} = useParams()
    // console.log(id);
    
    const [userNotes,setUserNotes]=useState([])
    
    //getAll
     const getAllNotes = async () => {
        try {
            const response = await axios.post('http://localhost:4012/admin/admin-user-note/'+id,{},{withCredentials:true})
            // console.log(response);
            
            if (response.data.data) {

                setUserNotes(response.data.data)
            } else {
                
                console.log(response);
            }
        } catch (error) {
            console.log(error);            
        }
    }
    useEffect(()=>{
        getAllNotes()
    },[])
    return (
        <>
          <div className="w-full">
      <table className="w-full  divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note Text
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userNotes.map((note) => (
            <tr key={note._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {note.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {note.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {note.text.length>20?note.text.slice(0,40) +'...':note.text}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {note.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {note.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
    )
}

export default User
