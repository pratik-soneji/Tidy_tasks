
import { AiOutlineDropbox } from 'react-icons/ai'

import { MdSearch } from "react-icons/md";
import '../App.css'
import { useNavigate } from 'react-router-dom';


function Navbar() {
    const nav=useNavigate()
   //LOGOUT

   const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    nav('/'); // Redirect to the login page
}
    return (
     <>
     <div className="navbar relative flex  p-2 w-full ">
        <div className="flex w-full justify-items-start items-center gap-5">
            
            <div className="flex w-40" >
                <AiOutlineDropbox color='red' size={35} />
                <h1 className='pl-2 text-2xl text-neutral-600'>Keep</h1> 
            </div>
            <div className="flex items-center w-2xl border border-none rounded-md overflow-hidden bg-gray-100 focus-within:bg-white focus-within:shadow">
                <div className="pl-3 ">
                    <MdSearch className='text-neutral-600' size={24}/>
                </div>
                <input type="text" name="search" className=' w-full h-12 rounded-md px-2 focus:outline-none  ' placeholder='Search'/>                
            </div>
        </div>
        
        <button onClick={handleLogout} className='bg-red-500 text-white font-bold cursor-pointer w-30 rounded-2xl'>Log Out </button>
        
     </div>
     </>   
    )
}

export default Navbar
