import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import main from '../../assets/main.png';
import recommend from '../../assets/recommend.png';
import nav_map from '../../assets/nav_map.png';
import forkplus from '../../assets/forkplus.png';
import searchIcon from '../../assets/searchIcon.png';


const NavBar = () => {
  const location = useLocation();

  return (
    <div>
      <Outlet />
      <div className='nav-bar'>
        <Link to='/searchresult'>
          <img
            src={searchIcon}
            className={
              location.pathname === '/searchresult'
                ? 'nav-icon active-icon'
                : 'nav-icon'
            }
          />
        </Link>
        <Link to='/recommend' state={{mainArtist: '', isUserRecom: 'artist'}}>
          <img
            src={recommend}
            className={
              location.pathname === '/recommend'
                ? 'nav-icon active-icon'
                : 'nav-icon'
            }
          />
        </Link>
        <Link to='/main'>
          <img
            src={main}
            className={
              location.pathname === '/main'
                ? 'nav-icon active-icon'
                : 'nav-icon'
            }
          />
        </Link>
        <Link to='/map'>
          <img
            src={nav_map}
            className={
              location.pathname === '/map' ? 'nav-icon active-icon' : 'nav-icon'
            }
          />
        </Link>
        <Link to='/bookmark'>
          <img
            src={forkplus}
            className={
              location.pathname === '/bookmark'
                ? 'nav-icon active-icon'
                : 'nav-icon'
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
