// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import Loading from './Components/LoadingIndicator';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import Login from './Components/Login';
// import Home from './Components/Home';
// import FahrtErstellen from './Components/FahrtErstellen';

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//       <RouterProvider 
//           router={createBrowserRouter([{
//               path: "/",
//               children: [
//                   { path: "", element: <Login /> },
//                   { path: "home", element: <Home /> },
//                   { path: "test", element: <Loading /> },
//               ],
//             //   errorElement: <App /> /* TODO: create a nice looking error page */
//           }])}
//           fallbackElement={<Loading />}
//       />
//   </React.StrictMode>
// );
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import FahrtErstellen from './Components/FahrtErstellen';
import Loading from './Components/LoadingIndicator';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="test" element={<Loading />} />
        <Route path="create" element={<FahrtErstellen />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
