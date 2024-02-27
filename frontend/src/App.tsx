import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { LoginContext, getLoginInfo } from './Components/Logincontext';
import { UserContext } from './Components/UserContext';
import { UserResource } from './util/Resources';
import { useLocation } from 'react-router-dom';
import { getUser } from './Api/api';

function App() {

  const [loginInfo, setLoginInfo] = useState(getLoginInfo());
  const [userInfo, setUserInfo] = useState<UserResource | null>(null);


  useEffect(() => {
    async function getUserData() {
      if (!loginInfo)
        return;
      try {
        setUserInfo(await getUser(loginInfo.userID));
      } catch (error) { }
    }
    getUserData();
  }, [loginInfo, userInfo]);

  const route: string = useLocation().pathname.substring(1);

  const getRouteName = (): string => {
    let routeName: string = route;

    if (routeName.endsWith("/")) {
      routeName.slice(0, routeName.length - 1);
    }

    return routeName.split("/")[0];
  }

  return (
    <div className="App">

      <LoginContext.Provider value={[loginInfo, setLoginInfo]}>
        <UserContext.Provider value={[userInfo, setUserInfo]}>
          {/* <FahrtProvider>
          </FahrtProvider> */}
        </UserContext.Provider>
      </LoginContext.Provider>
    </div >
  );
}

export default App;
