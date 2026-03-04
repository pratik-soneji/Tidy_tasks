
import { useState } from "react";
import UserContext from "./context.js";

const UserContextProvider = ({children}) => {
    const [resMessage, setResMessage] = useState(false)
    const [error, setError] = useState('')
    
    const [view, setView] = useState(false)

    const [user,setUser]=useState({})
    const [userUpdate,setUserUpdate]=useState(false)

    const [dataUpdate,setDataUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [data,setData]=useState([])

    const [trash,setTrash]=useState([])
    const [trashUpdate,setTrashUpdate] = useState(false)
    const [resTrashMessage,setResTrashMessage]=useState('')
    return(
        <UserContext.Provider value={{trashUpdate,setTrashUpdate,resTrashMessage,setResTrashMessage,trash,setTrash,userUpdate,setUserUpdate,view, setView,message, setMessage,error, setError,dataUpdate,setDataUpdate,user,setUser,data,setData,resMessage,setResMessage}}>
        {children}
         </UserContext.Provider>
    )
}

export {UserContext}
export default UserContextProvider