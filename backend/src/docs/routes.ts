import userRouter from "Router/UserRouter";
import loginRouter from "../Login/LoginRouter";
import { Express } from "express";


export default function routes(app: Express) {
    /**
 * @openapi
 * '/':
 *   post:
 *     tags:
 *       - Login User
 *     summary: Register a user
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
 *       401:
 *         description: <strong>Can't create a JWT</strong>
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




    app.post("/api/login", loginRouter);

  /**
 * @openapi
 * '/admin/users':
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
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
 *       403:
 *         description: <strong>Forbidden (User is not an admin)</strong>
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
 */






    app.get("/admin/users", userRouter);

    
  /**
 * @openapi
 * '/admin/finde/user/{id}':
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID (requires authentication)
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
 *     security:
 *       - bearerAuth: []
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


    app.put("/admin/delete/{id}", userRouter);
}