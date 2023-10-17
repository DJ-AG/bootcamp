import React, { useRef } from 'react';
import {SiBasecamp} from 'react-icons/si';
import {BsBook} from 'react-icons/bs';
import {FiMapPin} from 'react-icons/fi';
import {RiLoginCircleLine} from 'react-icons/ri';
import "./HamburgerMenu.css";

function SidebarNavigation() {

    const hamburgerMenuRef = useRef(null);
    const navRef = useRef(null);

    const toggleMenu = () => {
        if (hamburgerMenuRef.current && navRef.current) {
            hamburgerMenuRef.current.classList.toggle("hamburger-menu--open");
            navRef.current.classList.toggle("nav--open");
        }
    };

    return (
        <div className="sidebar">
            <div className="hamburger-menu__container" onClick={toggleMenu}>
                <div className="hamburger-menu" ref={hamburgerMenuRef}>
                    <div className="hamburger-menu__line"></div>
                    <div className="hamburger-menu__line"></div>
                    <div className="hamburger-menu__line"></div>
                </div>
            </div>
            <nav className="nav" ref={navRef}>
                <div className="nav__item">
                    <SiBasecamp data-feather="user" size={40} color="#e0e0e0"></SiBasecamp>
                    <span className="nav__item-text">BootCamps</span>
                </div>
                <div className="nav__item">
                    <BsBook data-feather="bookmark" size={40} color="#e0e0e0"></BsBook>
                    <span className="nav__item-text">Courses</span>
                </div>
                <div className="nav__item">
                    <FiMapPin data-feather="bar-chart-2" size={40} color="#e0e0e0"></FiMapPin>
                    <span className="nav__item-text">Map</span>
                </div>
                <div className="nav__item">
                    <RiLoginCircleLine data-feather="arrow-down-circle" size={40} color="#e0e0e0"></RiLoginCircleLine>
                    <span className="nav__item-text">Login</span>
                </div>
            </nav>
        </div>
    );
}

export default SidebarNavigation;