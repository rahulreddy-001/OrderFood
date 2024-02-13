import React, { createContext, useContext, useState, useEffect } from 'react';
import History from './History';
import Profile from './Profile';
import Cart from './Cart';
import Menu from './Menu';
import Wallet from './Wallet'
import NavBar from "./components/NavBar";
import BottomNavBar from './components/BottomNavBar';

const NavContext = createContext();

export const CustomerNavProvider = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => { 
    const handleResize = () => {  
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const components = {
    menu: <Menu/>,
    cart: <Cart/>,
    history: <History/>,
    profile: <Profile/>,
    wallet : <Wallet/>,
  };

  return (
    <NavContext.Provider value={{ activeTab, setActiveTab }}>
      <div style={{paddingBottom : "100px", minHeight: '100vh', backgroundColor: 'rgba(195, 195, 195, 0.33)'}}>  
        <NavBar/>
        {components[activeTab]}
        {windowWidth <= 600 && (
          <div style={{ position: "fixed", bottom: "0", width: "100%", backgroundColor: "white", borderTop: "1px solid grey", textAlign: "center" }}>
            <BottomNavBar/>
          </div>
        )}
      </div>
    </NavContext.Provider>
  );
};

export const useNav = () => {
  return useContext(NavContext);
};