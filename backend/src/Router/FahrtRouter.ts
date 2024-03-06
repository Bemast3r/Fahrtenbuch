import { requiresAuthentication } from "../Middleware/auth";
import { createUserFahrt, deleteFahrt, getFahrten, getUserFahrten, updateUserfahrt } from "../Services/FahrtService";
import { FahrtResource } from "../db/Resources";
import express from "express";
import { body, validationResult, matchedData, param } from "express-validator";

export const fahrrouter = express.Router();

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
 * Auch normale können drauf zugreifen.
 * 
 */
fahrrouter.get("/admin/fahrt/user/:id", requiresAuthentication,
    param("id").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await getUserFahrten(req.params.id);
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Erstellt eine Fahrt 
 */
fahrrouter.post("/user/fahrt/erstellen", requiresAuthentication,
    body("id").optional().isMongoId(),
    body("fahrerid").isString(),
    body("kennzeichen").isString(),
    body("kilometerstand").isNumeric(),
    body("startpunkt").isString(),

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

fahrrouter.put("/user/fahrt/bearbeiten/:id",
    requiresAuthentication,
    param("id").isMongoId(),
    body("id").optional().isMongoId(),
    body("fahrerid").isString(),
    body("kennzeichen").isString(),
    body("kilometerstand").isNumeric(),
    body("kilometerende").optional().isNumeric(),
    body("lenkzeit").optional().isArray(),
    body("arbeitszeit").optional().isArray(),
    body("pause").optional().isArray(),
    body("beendet").optional().isBoolean(),
    body("ruhezeit").optional().isArray(),
    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(req.body)
            console.log(errors)
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const resource = matchedData(req) as FahrtResource
            const fahrt = await updateUserfahrt(resource);
            return res.send(fahrt); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

/**
 * Löscht fahrt
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

export default fahrrouter;