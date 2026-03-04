import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import "./index.css";
import AdminLogin from "./Routes/AdminLogin";
import Layout from "./Routes/Layout";
import Users from "./Routes/Users";
import Trash from "./Routes/Trash";
import Notes from "./Routes/Notes";
import {getAllLoader} from './Routes/Users'
import User from "./Routes/User";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin" element={<Layout />}>
        <Route path="" element={<Users />} loader={getAllLoader}/> 
        <Route path=":id" element={<User />} /> 
        <Route path="notes" element={<Notes />} />
        <Route path="trash" element={<Trash />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
