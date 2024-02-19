import { requiresAuthentication } from "../Middleware/auth";
import { createUserFahrt, deleteFahrt, getFahrten, getUserFahrten, updateUserfahrt } from "../Services/FahrtService";
import { FahrtResource } from "../db/Resources";
import express from "express";
import { body, validationResult, matchedData, param } from "express-validator";

export const fahrrouter = express.Router();


/**
 * Erstellt eine Fahrt 
 */
fahrrouter.post("/user/fahrt/erstellen", requiresAuthentication,
    body("id").optional().isMongoId(),
    body("fahrerid").isString(),
    body("kennzeichen").isString(),
    body("kilometerstand").isString(),
    body("kilometerende").isString(),
    body("lenkzeit").optional().isString(),
    body("arbeitszeit").optional().isString(),
    body("pause").optional().isString(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const fahr = matchedData(req) as FahrtResource
            const fahrt = await createUserFahrt(fahr);
            return res.send(fahrt); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Fahrt beendet
 */
fahrrouter.post("/user/fahrt/beenden", requiresAuthentication)


/**
 * Fahrt beendet
 */
fahrrouter.post("/user/fahrt/pause", requiresAuthentication,)

/**
 * Fahrt lenkzeit
 */
fahrrouter.post("/user/fahrt/lenkzeit", requiresAuthentication,)


/**
 * Bekomme alle Fahrten
 */

fahrrouter.get("/admin/alle/fahrten", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const user = await getFahrten();
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);


/**
 * Fahrten von einem User über seine Id 
 */
fahrrouter.get("/admin/fahrt/user/:id", requiresAuthentication,
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
            const user = await getUserFahrten(req.params.id);
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Lösch fahrt
 */

fahrrouter.delete("/admin/lösch/fahrt/:id", requiresAuthentication,
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
            const user = await deleteFahrt(req.params.id);
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

fahrrouter.post("/user/fahrt/bearbeiten",
    requiresAuthentication,
    body("id").optional().isMongoId(),
    body("fahrerid").isString(),
    body("kennzeichen").isString(),
    body("kilometerstand").isString(),
    body("kilometerende").isString(),
    body("lenkzeit").optional().isString(),
    body("arbeitszeit").optional().isString(),
    body("pause").optional().isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403);
            }
            const resource = matchedData(req) as FahrtResource
            const fahrt = await updateUserfahrt(resource); 
            return res.send(fahrt); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

export default fahrrouter