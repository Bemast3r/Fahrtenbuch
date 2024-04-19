
# SKM Journey Log

### The SKM Journey Log is a digital solution developed in response to a commission from SKM. It serves as a modern alternative to traditional manual journey logging processes.

The primary objective of the SKM Journey Log project was to digitize the manual process of maintaining journey logs. By offering features such as time tracking, standardized journeys, and visualization capabilities, the SKM Journey Log aims to simplify the task of recording and managing travel activities for both administrators and users.  

**Key Features:**

- **Time Tracking:** Users can record various time metrics such as work hours, driving time, and breaks, streamlining the process of tracking travel activities.

- **Standardized Journeys:** Journeys are created following the same standards as traditional paper logbooks, ensuring compliance with established norms.

- **Visual Representation:** Journey data is captured and presented in a graphical format, allowing users to visualize their travel patterns and activities over time.

- **Admin Overview:** Administrators have access to a comprehensive overview of all journeys recorded within the system, facilitating efficient monitoring and management of transportation activities.

- **User Dashboard:** Users benefit from a personalized dashboard where they can view and manage their own journeys, providing them with a convenient way to track their travel history.



# Tech Stack

## Backend

### Runtime Environment
- **Node.js**: A server-side JavaScript runtime environment.

### Routing:
- **Express.js**: A minimalist and flexible Node.js web application framework for building web applications and APIs.

### Database:
- **MongoDB**: A document-oriented NoSQL database.

### Programming Language:
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.

### Testing:
- **Jest**: A JavaScript testing framework with a focus on simplicity.
- **Postman**: An API client that simplifies the process of testing, documenting, and sharing APIs.
- **MongoDB Memory Server**: An in-memory MongoDB implementation for testing.
- **Supertest**: A library for testing Node.js HTTP servers, which we used for route testing in combination with Jest.

### Development Tools:
- **Nodemon**: A utility that enhances the development workflow by automatically restarting the Node.js server upon detecting changes in the source code.

### Database and Middleware Libraries:
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Dotenv**: A library for loading environment variables from a `.env` file in Node.js applications.
- **Body-parser**: A middleware package for parsing JSON, raw, text, and URL-encoded data in Express.js applications.
- **Cors**: A middleware package for enabling CORS (Cross-Origin Resource Sharing) in Express.js applications.
- **Jsonwebtoken**: A library for creating and validating JSON Web Tokens (JWT) in Node.js.
- **Express-validator**: A middleware for validating and sanitizing user input in Express.js applications.
- **Moment-timezone**: A library for manipulating date and time in Node.js with timezone support.

### Email Sending:
- **Nodemailer**: A library for sending emails via Node.js.

---


## Frontend
### Framework / Library:
- **React**: JavaScript library for building user interfaces.
- **React Router DOM**: Routing library for React applications, enabling navigation between different pages.
- **React Bootstrap**: React component library based on Bootstrap, facilitating the creation of responsive and user-friendly UIs.
- **Chart.js**: JavaScript library for creating interactive and appealing charts.
- **React Chartjs 2**: React component library for Chart.js, making it easier to use Chart.js charts in React applications.

### Styling:
- **Bootstrap**: CSS framework for designing responsive and user-friendly websites.
- **Bootstrap Icons**: Collection of SVG icons specifically designed for use with Bootstrap.
- **Boxicons**: Library of vector icons and logos in SVG format.

### Date and Time Processing:
- **Date-fns**: Modern JavaScript library for manipulating date and time values.
- **Moment.js** (via @types/moment): Library for processing, validating, manipulating, and displaying date and time in JavaScript.

### HTTP Requests:
- **Fetch**: JavaScript API for making HTTP requests from web browsers.

### Data Processing / PDF Generation:
- **Html2canvas**: JavaScript library for rasterizing HTML elements into canvas elements.
- **jsPDF**: JavaScript library for generating PDF files in the browser.
- **jsPDF-AutoTable**: A plugin for generating automatic table layouts in PDF documents using jsPDF.
  
---

## Environment Variables

To run this project properly, you need certain Environment Variables, please contact one of the [Authors](#Authors).  

## Set up Project

Clone the project

```bash
  git clone https://github.com/Bemast3r/Fahrtenbuch.git
```

Go to the project directory and install dependencies 

```bash
  npm install
  npm run update
```
If you've already installed dependencies once, you can simply run `npm run update` to update them.  
This will update the frontend and backend dependencies.

Start the server

```bash
  npm run start
```

## Deployment
Both our frontend and backend have been deployed on Vercel.\
Links leading to our current Website are:
- [Frontend](https://fahrtenbuch.vercel.app/home)
- [Backend](https://fahrtenbuch-backend.vercel.app/)


## Documentation

BEENDE DIESEN PUNKT MIT DEM VERCEL LINK.

The Documentation is available on http://localhost:5000/docs/#/ or just click [here](http://localhost:5000/docs/#/).


## Running Tests

To run tests, run the following command

```bash
  cd backend
```
and then 
```bash
  npm run test
```



## Screenshots

- Login  
![Login](https://snipboard.io/ri1jeq.jpg)  

- Benutzer Registrieren
 ![Benutzer Registrieren](https://snipboard.io/CuIdtA.jpg)  
 
- Home  
![Home](https://snipboard.io/KLNZr9.jpg)  

- Fahrt Erstellen  
![Fahrt Erstellen](https://snipboard.io/ueQNUx.jpg)  




## Authors

- [@Bemast3r](https://github.com/Bemast3r)
- [@UCaydin](https://github.com/UCaydin)
- [@Can](https://github.com/KirinoSan1)
