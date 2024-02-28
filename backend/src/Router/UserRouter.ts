import { requiresAuthentication } from "../Middleware/auth";
import { createUser, deleteUser, getUser, getUsersFromDB, sendPasswordResetEmail, updateUser } from "../Services/UserService";
import { UserResource } from "../db/Resources";
import express from "express";
import { body, matchedData, param, validationResult } from "express-validator";

export const userRouter = express.Router();

/**
 * Holt alle User
 */
userRouter.get("/admin/users", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const users = await getUsersFromDB();
            return res.send(users); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Suche einen User
 */
userRouter.get("/admin/finde/user/:id", requiresAuthentication,
    param("id").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const user = await getUser(req.params.id)
            return res.send(user)
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
);

/**
 * Erstellt einen Benutzer 
 */
userRouter.post("/admin/user/erstellen", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
    body('email').isEmail(),
    body("password").isString(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const userRes = matchedData(req) as UserResource
            const user = await createUser(userRes);
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Wenn Nutzer Passwort vergisst bekommt er eine E-Mail
 */
userRouter.post("/admin/user/passwort-vergessen", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
    body('email').isEmail(),
    body("password").isString(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).send('E-Mail-Adresse ist erforderlich.');
            }

            await sendPasswordResetEmail(email);
            res.status(200).send('Passwort-Zurücksetzungs-E-Mail gesendet.');
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Ändere einen User.
 */
userRouter.put("/admin/user/aendern", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
    body('email').isEmail(),
    body('fahrzeuge').isArray().withMessage('fahrzeuge muss ein Array sein'),
    body("password").isString(),
    body("abwesend").isString(),
    body("admin").isBoolean(),
    // Das Datum sollte automatisch gesetzt werden.
    // body('fahrzeuge.*.datum').isString().notEmpty().withMessage('datum ist erforderlich und muss eine Zeichenkette sein'), 
    body('fahrzeuge.*.kennzeichen').isString().notEmpty().withMessage('kennzeichen ist erforderlich und muss eine Zeichenkette sein'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const userRes = req.body as UserResource; // Annahme: Die Benutzerressource ist im Anforderungskörper enthalten
            const user = await updateUser(userRes);
            return res.send(user);
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
);

/**
 * Löscht den Benutzer
 */
userRouter.delete("/admin/delete/:id", requiresAuthentication,
    param("id").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const user = matchedData(req) as UserResource
            const deleted = await deleteUser(user.id);
            return res.send(deleted); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

export default userRouter;