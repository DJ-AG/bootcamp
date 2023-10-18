import { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import SideBar from "./component/SideBar";
import MainContent from "./pages/MainContet/MainContent";
import Bootcamps from "./pages/Bootcamps/Bootcamps";
import Login from "./pages/Login/Login";
import Corses from "./pages/Courses/Courses";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainContent />,
      },
      {
        path: "bootcamps",
        element: <Bootcamps />,
      },
      {
        path: "courses",
        element: <Corses />,
      },
      {
        path: "login",
        element: <Login />,
      }
    ],
  },
]);

function Layout() {
  return (
    <main className="relative min-h-screen flex overflow-hidden">
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  );
}