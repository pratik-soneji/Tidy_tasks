import { CgNotes } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import { IoArchiveOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function HiddenSideBar() {
    const nav = useNavigate()
    return (
        <>
        <div className="">
            <div>
                <button  onClick={()=>(nav('/'))} className='p-3.5 rounded-4xl focus-within:bg-amber-100 cursor-pointer'>
                <CgNotes size={22}/>
            </button>
            </div>
            <div>
                <button onClick={()=>(nav('/reminders'))} className='p-3.5 rounded-4xl focus-within:bg-amber-100 cursor-pointer '>
            <FaRegBell   size={22}/>
            </button>
            </div>
            <div>
                <button className='p-3.5 rounded-4xl focus-within:bg-amber-100 cursor-pointer '>
            <TiPencil size={22}/>
            </button>
            </div>
            <div>
                <button onClick={()=>(nav('/archive'))} className='p-3.5 rounded-4xl focus-within:bg-amber-100 cursor-pointer '>
            <IoArchiveOutline size={22}/>
            </button>
            </div>
            <div>
                <button onClick={()=>(nav('/trash'))} className='p-3.5 rounded-4xl focus-within:bg-amber-100 cursor-pointer '>
            <FaRegTrashAlt  size={22}/>
            </button>
            </div>
        </div>
        </>
    )
}

export default HiddenSideBar
