import userRouter from "Router/UserRouter";
import loginRouter from "../Login/LoginRouter";
import { Express } from "express";


export default function routes(app: Express) {
 /**
 * @openapi
 * '/login':
 *   post:
 *     tags:
 *       - Login
 *     summary: Authenticate user and obtain JWT
 *     description: |
 *       The authentication process involves the usage of JSON Web Tokens (JWT) to authenticate and authorize users.
 *       This process ensures secure access to protected resources within the system.
 *       
 *       ### Middleware for Authentication
 *       The `requiresAuthentication` middleware function is utilized to protect routes that require authentication.
 *       This function performs the following steps:
 *       
 *       - Checks for the presence of a valid JWT in the request header.
 *       - If a valid JWT is found, it extracts the user ID and role from the token and attaches them to the request object.
 *       - If the JWT is invalid or missing, it returns a 401 Unauthorized error along with appropriate headers.
 *       
 *       ### Middleware for Optional Authentication
 *       The `optionalAuthentication` middleware function provides support for routes where authentication is optional.
 *       It performs the following actions:
 *       
 *       - Checks if a JWT exists in the request header.
 *       - If a JWT is present, it delegates the authentication process to the `requiresAuthentication` middleware.
 *       - If no JWT is found, it proceeds to the next middleware without generating an error.
 *       
 *       ### Login Endpoint
 *       The `/login` endpoint allows users to authenticate and obtain a JWT for accessing protected resources.
 *       It supports the following operations:
 *       
 *       - **POST `/login`**: Accepts username and password in the request body, validates the credentials,
 *       and returns a JWT upon successful authentication. In case of invalid credentials, appropriate error responses are provided.
 *       
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 12
 *               password:
 *                 type: string
 *                 
 *     responses:
 *       201:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token_type:
 *                   type: string
 *                 access_token:
 *                   type: string
 *                   
 *       400:
 *         description: <strong>Validation error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         
 *       401:
 *         description: <strong>Can't create a JWT</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


    app.post("/api/login", loginRouter);

 /**
 * @openapi
 * '/admin/users':
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (admin only)
 *     description: |
 *       This endpoint retrieves a list of all users from the database. Access is restricted to admin users.
 *       
 *       ### Middleware for Authentication
 *       The `requiresAuthentication` middleware function is utilized to protect routes that require authentication.
 *       This function ensures that only authenticated users can access the endpoint.
 *       
 *       ### Authorization
 *       Access to this endpoint is restricted to users with the role "admin" (`req.role === "a"`).
 *       If the requesting user does not have the necessary permissions, a 403 Forbidden response is returned.
 *       
 *       ### Retrieving Users
 *       Upon successful authentication and authorization, the endpoint fetches user data from the database.
 *       The retrieved users are returned as an array of `UserResource` objects.
 *       
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   vorname:
 *                     type: string
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   admin:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                   fahrzeuge:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         datum:
 *                           type: string
 *                         kennzeichen:
 *                           type: string
 *                 
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         
 *       403:
 *         description: <strong>Forbidden</strong>
 *         
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.get("/admin/users", userRouter);

    
/**
 * @openapi
 * '/admin/finde/user/{id}':
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID (requires authentication)
 *     description: |
 *       This endpoint retrieves a user from the database based on the provided user ID. 
 *       Access to this endpoint is restricted to authenticated users.
 *       
 *       ### Middleware for Authentication
 *       The `requiresAuthentication` middleware function is utilized to protect routes that require authentication.
 *       This function ensures that only authenticated users can access the endpoint.
 *       
 *       ### Retrieving Users
 *       Upon successful authentication, the endpoint fetches user data from the database based on the provided user ID.
 *       The retrieved user is returned as a `UserResource` object.
 *       
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: mongo-id
 *         required: true
 *         description: <strong>ID of the user to find</strong>
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 vorname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 admin:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 fahrzeuge:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       datum:
 *                         type: string
 *                       kennzeichen:
 *                         type: string
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       404:
 *         description: <strong>Validation error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.get("/admin/finde/user/:id", userRouter);

/**
 * @openapi
 * '/admin/finde/user/alle/admin':
 *   get:
 *     tags:
 *       - User
 *     summary: Get all admin users (requires authentication)
 *     description: |
 *       This endpoint retrieves all admin users from the database. Access is restricted to admin users.
 *       
 *       ### Middleware for Authentication
 *       The `requiresAuthentication` middleware function is utilized to protect routes that require authentication.
 *       This function ensures that only authenticated users can access the endpoint.
 *       
 *       ### Authorization
 *       Access to this endpoint is restricted to users with the role "admin" (`req.role === "a"`).
 *       If the requesting user does not have the necessary permissions, a 403 Forbidden response is returned.
 *       
 *       ### Retrieving Admin Users
 *       Upon successful authentication and authorization, the endpoint fetches all users from the database
 *       and filters out the admin users. The retrieved admin users are returned as an array of `UserResource` objects.
 *       
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   vorname:
 *                     type: string
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   admin:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   fahrzeuge:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         datum:
 *                           type: string
 *                         kennzeichen:
 *                           type: string
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.get("/admin/finde/user/alle/admin", userRouter);

/**
 * @openapi
 * '/admin/user-erstellen':
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to create a new user in the system.
 *       
 *       ### Middleware for Authentication
 *       The `requiresAuthentication` middleware function is utilized to protect routes that require authentication.
 *       This function ensures that only authenticated users can access the endpoint.
 *       
 *       ### Authorization
 *       Access to this endpoint is restricted to users with the role "admin" (`req.role === "a"`).
 *       If the requesting user does not have the necessary permissions, a 403 Forbidden response is returned.
 *       
 *       ### Creating a User
 *       Upon successful authentication and authorization, the endpoint creates a new user in the system
 *       based on the provided user data in the request body.
 *       The newly created user is returned as a `UserResource` object.
 *       
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vorname:
 *                 type: string
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               admin:
 *                 type: boolean
 *               fahrzeuge:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     datum:
 *                       type: string
 *                     kennzeichen:
 *                       type: string
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 vorname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 admin:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 fahrzeuge:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       datum:
 *                         type: string
 *                       kennzeichen:
 *                         type: string
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.post("/admin/user-erstellen", userRouter);

 /**
 * @openapi
 * '/passwort-vergessen':
 *   post:
 *     tags:
 *       - User
 *     summary: Request password reset
 *     description: |
 *       This endpoint allows a user to request a password reset by providing their email address.
 *       
 *       ### Request Body
 *       The request body must contain the user's email address in JSON format.
 *       Example:
 *       ```
 *       {
 *         "email": "user@example.com"
 *       }
 *       ```
 *       
 *       ### Sending Password Reset Email
 *       Upon receiving the request, the endpoint sends a password reset email to the provided email address.
 *       The email contains a link for the user to reset their password.
 *       
 *       ### Response
 *       - If the password reset email is successfully sent, a 200 OK response is returned with a message indicating
 *         that the password reset email has been sent.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned
 *         with error details.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned
 *         with an error message.
 *       
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.post("/passwort-vergessen", userRouter);

   /**
 * @openapi
 * '/passwort-zuruecksetzen/{token}':
 *   post:
 *     tags:
 *       - User
 *     summary: Reset password with token
 *     description: |
 *       This endpoint allows a user to reset their password by providing a valid reset token and the new password.
 *       
 *       ### Request Parameters
 *       - `token` (path parameter): Token for password reset. It should be included in the URL path.
 *       
 *       ### Request Body
 *       The request body must contain the new password in JSON format.
 *       Example:
 *       ```
 *       {
 *         "password": "newpassword123"
 *       }
 *       ```
 *       
 *       ### Resetting Password
 *       Upon receiving the request, the endpoint verifies the token's validity and updates the user's password.
 *       If the token is valid, the user's password is updated with the provided new password.
 *       
 *       ### Response
 *       - If the password is successfully reset, a 200 OK response is returned with a message indicating
 *         that the password has been reset.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned
 *         with error details.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned
 *         with an error message.
 *       
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: <strong>Token for password reset</strong>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
    app.post("/passwort-zuruecksetzen/{token}", userRouter);

    /**
 * @openapi
 * '/admin/user/aendern':
 *   put:
 *     tags:
 *       - User
 *     summary: Update user information (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to update user information such as name, username, password, vehicles, etc.
 *       
 *       ### Request Body
 *       The request body must contain the updated user information in JSON format. The following fields can be updated:
 *       - `vorname` (string): The user's first name.
 *       - `name` (string): The user's last name.
 *       - `username` (string): The user's username.
 *       - `password` (string): The user's password.
 *       - `admin` (boolean): Indicates whether the user has admin privileges.
 *       - `fahrzeuge` (array): An array of vehicles associated with the user. Each vehicle object should contain the following properties:
 *           - `datum` (string): The date of the vehicle.
 *           - `kennzeichen` (string): The license plate of the vehicle.
 *       
 *       ### Response
 *       - If the user information is successfully updated, a 200 OK response is returned with the updated user information.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to perform the update (i.e., not an admin), a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vorname:
 *                 type: string
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               fahrzeuge:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     datum:
 *                       type: string
 *                     kennzeichen:
 *                       type: string
 *               password:
 *                 type: string
 *               admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 vorname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 fahrzeuge:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       datum:
 *                         type: string
 *                       kennzeichen:
 *                         type: string
 *                 password:
 *                   type: string
 *                 admin:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

    app.put("/admin/user/aendern", userRouter);

 /**
 * @openapi
 * '/admin/delete/{id}':
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by ID (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to delete a user by providing their ID.
 *       
 *       ### Request Parameters
 *       - `id` (string, required): The unique ID of the user to delete.
 *       
 *       ### Response
 *       - If the user is successfully deleted, a 200 OK response is returned with a success message.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to perform the deletion (i.e., not an admin), a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: mongo-id
 *         required: true
 *         description: <strong>ID of the user to delete</strong>
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
    app.delete("/admin/delete/{id}", userRouter);

/**
 * @openapi
 * '/admin/alle/fahrten':
 *   get:
 *     tags:
 *       - Trip
 *     summary: Get all Trips (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to retrieve all trips.
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with an array of trip objects.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource (i.e., not an admin), a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   id:
 *                     type: string
 *                   fahrerid:
 *                     type: string
 *                   kennzeichen:
 *                     type: string
 *                   kilometerstand:
 *                     type: number
 *                   kilometerende:
 *                     type: number
 *                   lenkzeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   pause:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   arbeitszeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   startpunkt:
 *                     type: string
 *                   beendet:
 *                     type: boolean
 *                   ruhezeit:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         stop:
 *                           type: string
 *                           format: date-time
 *                   endpunkt:
 *                     type: string
 *                   abwesend:
 *                     type: string
 *                   totalArbeitszeit:
 *                     type: number
 *                   totalLenkzeit:
 *                     type: number
 *                   totalPause:
 *                     type: number
 *                   totalRuhezeit:
 *                     type: number
 *                   vollname:
 *                     type: string
 * 
 *       400:
 *         description: <strong>Bad request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
     app.get("/admin/alle/fahrten", loginRouter);

    /**
 * @openapi
 * '/admin/fahrt/user/{id}':
 *   get:
 *     tags:
 *       - Trip
 *     summary: Get all trips of a user (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to retrieve all trips of a specific user.
 *       
 *       ### Parameters
 *       - **id**: (path) [string] - <strong>ID of the user whose trips to retrieve</strong>
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with an array of trip objects.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource (i.e., not an admin), a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: mongo-id
 *         required: true
 *         description: <strong>ID of the user whose trips to retrieve</strong>
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   id:
 *                     type: string
 *                   fahrerid:
 *                     type: string
 *                   kennzeichen:
 *                     type: string
 *                   kilometerstand:
 *                     type: number
 *                   kilometerende:
 *                     type: number
 *                   lenkzeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   pause:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   arbeitszeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   startpunkt:
 *                     type: string
 *                   beendet:
 *                     type: boolean
 *                   ruhezeit:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         stop:
 *                           type: string
 *                           format: date-time
 *                   endpunkt:
 *                     type: string
 *                   abwesend:
 *                     type: string
 *                   totalArbeitszeit:
 *                     type: number
 *                   totalLenkzeit:
 *                     type: number
 *                   totalPause:
 *                     type: number
 *                   totalRuhezeit:
 *                     type: number
 *                   vollname:
 *                     type: string
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
     app.get("/admin/fahrt/user/{id}", loginRouter);

/**
 * @openapi
 * '/admin/laufende/fahrten':
 *   get:
 *     tags:
 *       - Trip
 *     summary: Get all ongoing trips (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to retrieve all ongoing trips.
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with an array of ongoing trip objects.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource (i.e., not an admin), a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   id:
 *                     type: string
 *                   fahrerid:
 *                     type: string
 *                   kennzeichen:
 *                     type: string
 *                   kilometerstand:
 *                     type: number
 *                   kilometerende:
 *                     type: number
 *                   lenkzeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   pause:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   arbeitszeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   startpunkt:
 *                     type: string
 *                   beendet:
 *                     type: boolean
 *                   ruhezeit:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         stop:
 *                           type: string
 *                           format: date-time
 *                   endpunkt:
 *                     type: string
 *                   abwesend:
 *                     type: string
 *                   totalArbeitszeit:
 *                     type: number
 *                   totalLenkzeit:
 *                     type: number
 *                   totalPause:
 *                     type: number
 *                   totalRuhezeit:
 *                     type: number
 *                   vollname:
 *                     type: string
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/admin/laufende/fahrten", loginRouter);

/**
 * @openapi
 * '/admin/beendete/fahrten':
 *   get:
 *     tags:
 *       - Trip
 *     summary: Get all completed trips (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to retrieve all completed trips.
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with an array of completed trip objects.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource (i.e., not an admin), a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   id:
 *                     type: string
 *                   fahrerid:
 *                     type: string
 *                   kennzeichen:
 *                     type: string
 *                   kilometerstand:
 *                     type: number
 *                   kilometerende:
 *                     type: number
 *                   lenkzeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   pause:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   arbeitszeit:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   startpunkt:
 *                     type: string
 *                   beendet:
 *                     type: boolean
 *                   ruhezeit:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         stop:
 *                           type: string
 *                           format: date-time
 *                   endpunkt:
 *                     type: string
 *                   abwesend:
 *                     type: string
 *                   totalArbeitszeit:
 *                     type: number
 *                   totalLenkzeit:
 *                     type: number
 *                   totalPause:
 *                     type: number
 *                   totalRuhezeit:
 *                     type: number
 *                   vollname:
 *                     type: string
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/admin/beendete/fahrten", loginRouter)

/**
 * @openapi
 * '/user/fahrt/erstellen':
 *   post:
 *     tags:
 *       - Trip
 *     summary: Create a new trip (requires authentication)
 *     description: |
 *       This endpoint allows a user to create a new trip.
 *       
 *       ### Request Body
 *       - The request body must contain the necessary information to create a trip, including driver ID, vehicle license plate, start point, etc.
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with the created trip object.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource, a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: mongo-id
 *               fahrerid:
 *                 type: string
 *               kennzeichen:
 *                 type: string
 *               vollname:
 *                 type: string
 *               endpunkt:
 *                 type: string
 *               kilometerstand:
 *                 type: number
 *               totalArbeitszeit:
 *                 type: number
 *               totalPause:
 *                 type: number
 *               totalLenkzeit:
 *                 type: number
 *               totalRuhezeit:
 *                 type: number
 *               startpunkt:
 *                 type: string
 *               ruhezeit:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *               lenkzeit:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *               abwesend:
 *                 type: string
 *               beendet:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 id:
 *                   type: string
 *                 fahrerid:
 *                   type: string
 *                 kennzeichen:
 *                   type: string
 *                 kilometerstand:
 *                   type: number
 *                 kilometerende:
 *                   type: number
 *                 lenkzeit:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 pause:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 arbeitszeit:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 startpunkt:
 *                   type: string
 *                 beendet:
 *                   type: boolean
 *                 ruhezeit:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                       stop:
 *                         type: string
 *                         format: date-time
 *                 endpunkt:
 *                   type: string
 *                 abwesend:
 *                   type: string
 *                 totalArbeitszeit:
 *                   type: number
 *                 totalLenkzeit:
 *                   type: number
 *                 totalPause:
 *                   type: number
 *                 totalRuhezeit:
 *                   type: number
 *                 vollname:
 *                   type: string
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/user/fahrt/erstellen", loginRouter)

/**
 * @openapi
 * '/user/fahrt/bearbeiten/{id}':
 *   put:
 *     tags:
 *       - Trip
 *     summary: Update a trip by ID (requires authentication)
 *     description: |
 *       This endpoint allows a user to update a trip by its ID.
 *       
 *       ### Path Parameters
 *       - `id`: ID of the trip to be updated.
 *       
 *       ### Request Body
 *       - The request body should contain the updated trip information.
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with the updated trip object.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource, a 403 Forbidden response is returned with an error message.
 *       - If the specified trip ID is not found, a 404 Not Found response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: mongo-id
 *         required: true
 *         description: <strong>ID of the trip to update</strong>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: mongo-id
 *               fahrerid:
 *                 type: string
 *               vollname:
 *                 type: string
 *               endpunkt:
 *                 type: string
 *               kennzeichen:
 *                 type: string
 *               kilometerstand:
 *                 type: number
 *               kilometerende:
 *                 type: number
 *               lenkzeit:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *               arbeitszeit:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *               pause:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *               beendet:
 *                 type: boolean
 *               ruhezeit:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                     stop:
 *                       type: string
 *                       format: date-time
 *               totalArbeitszeit:
 *                 type: number
 *               totalPause:
 *                 type: number
 *               totalLenkzeit:
 *                 type: number
 *               totalRuhezeit:
 *                 type: number
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 id:
 *                   type: string
 *                 fahrerid:
 *                   type: string
 *                 kennzeichen:
 *                   type: string
 *                 kilometerstand:
 *                   type: number
 *                 kilometerende:
 *                   type: number
 *                 lenkzeit:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 pause:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 arbeitszeit:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 startpunkt:
 *                   type: string
 *                 beendet:
 *                   type: boolean
 *                 ruhezeit:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                       stop:
 *                         type: string
 *                         format: date-time
 *                 endpunkt:
 *                   type: string
 *                 abwesend:
 *                   type: string
 *                 totalArbeitszeit:
 *                   type: number
 *                 totalLenkzeit:
 *                   type: number
 *                 totalPause:
 *                   type: number
 *                 totalRuhezeit:
 *                   type: number
 *                 vollname:
 *                   type: string
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.put("/user/fahrt/bearbeiten/{id}", loginRouter)

/**
 * @openapi
 * '/admin/loesch/fahrt/{id}':
 *   delete:
 *     tags:
 *       - Trip
 *     summary: Delete a trip by ID (requires authentication)
 *     description: |
 *       This endpoint allows an admin user to delete a trip by its ID.
 *       
 *       ### Path Parameters
 *       - `id`: ID of the trip to be deleted.
 *       
 *       ### Response
 *       - If the request is successful, a 200 OK response is returned with a success message.
 *       - If the request is malformed or missing required parameters, a 400 Bad Request response is returned with error details.
 *       - If the user is not authorized to access the resource, a 403 Forbidden response is returned with an error message.
 *       - If an internal server error occurs during the process, a 500 Internal Server Error response is returned with an error message.
 *       
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: mongo-id
 *         required: true
 *         description: <strong>ID of the trip to delete</strong>
 *     responses:
 *       200:
 *         description: <strong>Success</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: <strong>Bad Request</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: <strong>Internal Server Error</strong>
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.delete("/admin/loesch/fahrt/{id}", loginRouter)

/**
 * @openapi
 * components:
*   schemas:
*     User:
*       type: object
*       properties:
*         id:
*           type: string
*           format: mongo-id
*           example: 123a456b789c01234de567fg
*         vorname:
*           type: string
*           example: John
*         name:
*           type: string
*           example: Doe
*         username:
*           type: string
*           example: JohnDoe69
*         email:
*           type: string
*           format: email
*           example: johndoe@example.com
*         password:
*           type: string
*           format: Strong password
*           example: Test123!!Test123!!
*         admin:
*           type: boolean
*           example: true
*         createdAt:
*           type: string
*           format: date-time
*           example: "2024-04-22T16:11:09+02:00"
*         fahrzeuge:
*           type: array
*           items:
*             type: object
*             properties:
*               datum:
*                 type: string
*                 example: "2024-04-22"
*               kennzeichen:
*                 type: string
*                 example: "ABC123"
*         abwesend:
*           type: boolean
*           example: false
*       
*/
}