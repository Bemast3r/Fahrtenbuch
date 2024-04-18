import userRouter from "Router/UserRouter";
import { Express } from "express";


export default function routes(app: Express) {

    // ------------------------------------------------------------------------- USER ROUTES --------------------------------------------------------------------------------

    /**
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Logs in a user and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       201:
 *         description: Successful login. Returns an access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token_type:
 *                   type: string
 *                   description: Type of the token.
 *                 access_token:
 *                   type: string
 *                   description: The access token.
 *       400:
 *         description: Bad Request. Indicates missing or invalid parameters.
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
 *                       msg:
 *                         type: string
 *                         description: Error message.
 *                       param:
 *                         type: string
 *                         description: Parameter related to the error.
 *       401:
 *         description: Unauthorized. Indicates authentication failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal Server Error. Indicates server-side failure.
 */

}