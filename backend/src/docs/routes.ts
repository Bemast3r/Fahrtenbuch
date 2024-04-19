import userRouter from "Router/UserRouter";
import loginRouter from "../Login/LoginRouter";
import { Express } from "express";


export default function routes(app: Express) {
    /**
 * @openapi
 * '/':
 *   post:
 *     tags:
 *       - Login
 *     summary: Register a user
 *     description: BBBBBBBBBB
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


    app.delete("/admin/delete/{id}", userRouter);

/**
 * @openapi
 * '/admin/alle/fahrten':
 *   get:
 *     tags:
 *       - Trip
 *     summary: Get all Trips (requires authentication)
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

}