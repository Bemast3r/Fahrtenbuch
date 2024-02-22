import { requiresAuthentication } from "../Middleware/auth";
import { changeCar, createUser, deleteUser, getUser, getUsersFromDB, updateUser } from "../Services/UserService";
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
            return user
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
 * Ändert das Auto
 */
userRouter.put("/user/auto/wechseln", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
    body('fahrzeuge').isArray().withMessage('fahrzeuge muss ein Array sein'),
    body("password").isString(),
    body("abwesend").isBoolean(),
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
            const userRes = req.body as UserResource; // Annahme: Die Benutzerressource ist im Anforderungskörper enthalten
            const newCar = { kennzeichen: req.body.fahrzeuge[0].kennzeichen }; // Annahme: Ändern Sie nur ein Fahrzeug auf einmal
            const user = await changeCar(userRes, newCar);
            return res.send(user);
        } catch (error) {
            res.status(400);
            next(error);
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
    body('fahrzeuge').isArray().withMessage('fahrzeuge muss ein Array sein'),
    body("password").isString(),
    body("abwesend").isBoolean(),
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