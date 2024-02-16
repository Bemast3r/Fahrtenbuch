import { requiresAuthentication } from "Middleware/auth";
import { createUserFahrt, getFahrten } from "Services/FahrtService";
import { FahrtResource } from "db/Resources";
import express from "express";
import { body, validationResult, matchedData } from "express-validator";

export const fahrrouter = express.Router();


/**
 * Erstellt eine Fahrt 
 */
fahrrouter.post("/fahrt/erstellen", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
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
 * Bekomme alle Fahrten
 */

fahrrouter.get("/fahrten", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if(req.role !== "a"){
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

fahrrouter.get("/fahrten/meine", requiresAuthentication,
    body("name").isString(),
    body("nachname").isString(),
    body("username").isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if(req.role !== "a"){
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
