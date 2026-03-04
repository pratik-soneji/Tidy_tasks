import { Outlet } from "react-router-dom"
import AdminSideBar from '../Components/AdminSideBar'
import AdminNavbar from '../Components/AdminNavbar'
import '../App.css'

function Layout() {
    return (
        <>
          <div className="main w-screen relative">
          <AdminNavbar/>
                <div className="sub flex">
                    <AdminSideBar/>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout
