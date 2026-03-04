import { CgNotes } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import { IoArchiveOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";


function SIdebar() {
    const nav=useNavigate()   
    // const [sideBar, setSideBar] = useState()
    return (
        <>
        <div className="sm:w-72">
            <div onClick={()=>(nav('/admin'))} className="flex justify-items-start items-center focus-within:bg-amber-100 rounded-tr-3xl rounded-br-3xl">
            <div className='sm:pl-4 py-3 pl-5'>
                <CgNotes size={22}/>
            </div>
                <button className="hidden sm:block w-full text-start cursor-pointer py-3 px-4 ">Users</button>
            </div>

            <div onClick={()=>(nav('/admin/notes'))} className="flex justify-items-start items-center focus-within:bg-amber-100 rounded-tr-3xl rounded-br-3xl">
            <div className='sm:pl-4 py-3 pl-5'>
            <FaRegBell  size={22}/>
            </div>
                <button className="hidden sm:block w-full text-start cursor-pointer py-3 px-4 ">Notes</button>
            </div>
            
            <div onClick={()=>(nav('/admin/trash'))} className="flex justify-items-start items-center focus-within:bg-amber-100 rounded-tr-3xl rounded-br-3xl">
            <div className='sm:pl-4 py-3 pl-5'>
            <FaRegTrashAlt size={22}/>
            </div>
                <button className="hidden sm:block w-full text-start cursor-pointer py-3 px-4 ">Trash</button>
            </div>
        </div>
        </>
    )
}

export default SIdebar
