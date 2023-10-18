import React from 'react';
import {NavLink} from 'react-router-dom';
import Logo from './Logo';
import {IoIosHome} from 'react-icons/io';
import {GiCampingTent, GiBookCover} from 'react-icons/gi';
import {BiCurrentLocation} from 'react-icons/bi';

function Sidebar() {
    return (
<div className="bg-gray-900 sm:w-60 min-h-screen w-14 pt-4 transition-all">
  <Logo />
  <ul className="mt-11 space-y-5">
    <NavLink to="/bootcamps" className="hover:bg-gray-800 cursor-pointer sm:justify-start px-4 h-12 flex items-center justify-center">
      <GiCampingTent className="text-gray-400 text-xl" size="40" />
      <span className="ml-3 hidden sm:block text-gray-400 font-semibold tracking-wide hover:text-white transition-colors">Bootcamps</span>
    </NavLink>
    <NavLink to="/courses" className="hover:bg-gray-800 cursor-pointer sm:justify-start px-4 h-12 flex items-center justify-center">
      <GiBookCover className="text-gray-400 text-xl" size="40" />
      <span className="ml-3 hidden sm:block text-gray-400 font-semibold tracking-wide hover:text-white transition-colors">Courses</span>
    </NavLink>
    <NavLink to="/location" className="hover:bg-gray-800 cursor-pointer sm:justify-start px-4 h-12 flex items-center justify-center">
      <BiCurrentLocation className="text-gray-400 text-xl" size="40" />
      <span className="ml-3 hidden sm:block text-gray-400 font-semibold tracking-wide hover:text-white transition-colors">Location</span>
    </NavLink>
    <NavLink to="/about" className="hover:bg-gray-800 cursor-pointer sm:justify-start px-4 h-12 flex items-center justify-center">
      <IoIosHome className="text-gray-400 text-xl" size="40" />
      <span className="ml-3 hidden sm:block text-gray-400 font-semibold tracking-wide hover:text-white transition-colors">About</span>
    </NavLink>
    <NavLink to="/login" className="hover:bg-gray-800 cursor-pointer sm:justify-start px-4 h-12 flex items-center justify-center">
      <IoIosHome className="text-gray-400 text-xl" size="40" />
      <span className="ml-3 hidden sm:block text-gray-400 font-semibold tracking-wide hover:text-white transition-colors">Login</span>
    </NavLink>
  </ul>
</div>
    );
}

export default Sidebar;