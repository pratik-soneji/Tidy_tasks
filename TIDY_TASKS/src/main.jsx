import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Notes from './Routes/Notes.jsx'
import Reminders from './Routes/Reminders.jsx' 
import Archive from './Routes/Archive.jsx'
import Trash from './Routes/Trash.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import SignUp from './Routes/SignUp.jsx'
import Login from './Routes/Login.jsx'
import UserContextProvider from './Features/UserContext.jsx'
import Label from './Routes/Label.jsx'
import { ToastContainer } from 'react-toastify'
import ForgotPass from './Routes/ForgotPass'


createRoot(document.getElementById('root')).render(
 
    <UserContextProvider>
      <ToastContainer
          position="top-right"
          autoClose={5000}   // Automatically close toast after 5 seconds
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    <BrowserRouter>
    
      <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forgot' element={<ForgotPass/>}/>
      <Route path='/user' element={<Layout />}>          
          <Route path='' element={<Notes/>}/>
          <Route path='reminders' element={<Reminders/>}/>
          <Route path='archive' element={<Archive/>}/>
          <Route path='trash' element={<Trash/>}/>
          <Route path='label/:label' element={<Label/>}/>
      </Route>
      </Routes>
    </BrowserRouter>
    </UserContextProvider>
    
  ,
)
