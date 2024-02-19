import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Loading from './Components/LoadingIndicator';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './Components/Login';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider
          router={createBrowserRouter([{
              path: "/",
              element: <Login />,
              children: [
                  { path: "", element: <Loading /> },
              ],
              // errorElement: <App /> /* TODO: create a nice looking error page */
          }])}
          fallbackElement={<Loading />}
      />
  </React.StrictMode>
);
