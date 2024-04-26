import { requiresAuthentication } from "../Middleware/auth";
import { createUserFahrt, deleteFahrt, getBeendeteFahrten, getFahrten, getFahrtenOfModUsers, getLaufendeFahrten, getUserFahrten, updateUserfahrt } from "../Services/FahrtService";
import { FahrtResource } from "../Model/Resources";
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

fahrrouter.get("/mod/alle/fahrten", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "m") {
                return res.sendStatus(403)
            }
            const user = await getFahrtenOfModUsers(req.userId);
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);




fahrrouter.get("/admin/laufende/fahrten", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const beendeteFahrten = await getLaufendeFahrten();
            return res.send(beendeteFahrten);
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

fahrrouter.get("/admin/beendete/fahrten", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const beendeteFahrten = await getBeendeteFahrten();
            return res.send(beendeteFahrten);
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
    body("vollname").isString(),
    body("endpunkt").optional().isString(),
    body("kilometerstand").optional().isNumeric(),
    body("totalArbeitszeit").optional().isNumeric(),
    body("totalPause").optional().isNumeric(),
    body("totalLenkzeit").optional().isNumeric(),
    body("totalRuhezeit").optional().isNumeric(),
    body("startpunkt").isString(),
    body("ruhezeit").optional().isArray(),
    body("lenkzeit").optional().isArray(),
    body("abwesend").optional().isString(),
    body("beendet").optional().isBoolean(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            console.log(req.body)
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
    body("vollname").isString(),
    body("endpunkt").optional().isString(),
    body("kennzeichen").isString(),
    body("kilometerstand").optional().isNumeric(),
    body("kilometerende").optional().isNumeric(),
    body("lenkzeit").optional().isArray(),
    body("arbeitszeit").optional().isArray(),
    body("pause").optional().isArray(),
    body("beendet").optional().isBoolean(),
    body("ruhezeit").optional().isArray(),
    body("totalArbeitszeit").optional().isNumeric(),
    body("totalPause").optional().isNumeric(),
    body("totalLenkzeit").optional().isNumeric(),
    body("totalRuhezeit").optional().isNumeric(),
    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
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
fahrrouter.delete("/admin/loesch/fahrt/:id", requiresAuthentication,
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
            const res2 = await deleteFahrt(req.params.id);
            return res.send(res2); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

fahrrouter.delete("/mod/loesch/fahrt/:id", requiresAuthentication,
    param("id").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "m") {
                return res.sendStatus(403)
            }
            const res2 = await deleteFahrt(req.params.id);
            return res.send(res2); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

export default fahrrouter;