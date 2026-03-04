import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useState } from "react";
import signupback from '../assets/signupback.png'

function Login() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const nav=useNavigate()
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`http://localhost:4012/admin/login`, {
          password
        });
        setMessage('login successfull');
        if(response){ 
            console.log('in');
            console.log(response);
            
            nav('/admin')     }
      } catch (error) {
        setMessage(error.response.data.err);
      }
    };
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-purple-700 text-white font-sans"> 
            <div className="w-8/12 h-7/12 mx-auto flex  lg:w-2/3"> {/* Container for form and image */}

                {/* Form Section */}
                <div className="w-full lg:w-1/2 bg-white text-gray-800 p-12 rounded-l-lg">
                    <h2 className="text-2xl font-bold mb-4">Welcome Admin !</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 justify-items-center items-center gap-8">
                        
                        <div className="w-full  grid grid-cols-1 justify-items-start items-center gap-4">
                            <label htmlFor="password" className=" text-gray-500 font-semibold">Enter Password to access Tidy Tasks Admin :</label>
                            <input type="password" id="password" placeholder="Enter your password" required
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                            />
                        </div>
                        <button type="submit"
                            className="w-full cursor-pointer px-3 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition duration-300">
                            Verify
                        </button>
                        {message && <p className="text-center text-gray-500 font-semibold text-sm">{message}</p>}
    
                    </form>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-1/2 rounded-r-lg overflow-hidden relative">
                    <img src={signupback} className="object-cover w-full h-full" />
                    <div className="absolute bottom-6 left-6 text-xl"> {/* Adjusted positioning */}
                        Every new friend is a new adventure. <br />
                        Lets get connected
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}

export default Login
