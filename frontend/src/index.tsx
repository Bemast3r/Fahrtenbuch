import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Loading from './Components/LoadingIndicator';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './Components/Login';
import { getJWT } from './Components/Logincontext';
import Home from './Components/Home';


const jwt = getJWT()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider
          router={createBrowserRouter([{
              path: "/",
              children: [
                  { path: "", element: <Login /> },
                  { path: "home", element: <Home /> },
                  { path: "test", element: <Loading /> },
              ],
            //   errorElement: <App /> /* TODO: create a nice looking error page */
          }])}
          fallbackElement={<Loading />}
      />
  </React.StrictMode>
);
