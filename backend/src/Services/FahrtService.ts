import { User } from "../Model/UserModel";
import { Fahrt } from "../Model/FahrtModel";
import { FahrtResource, UserResource } from "../util/Resources";
import mongoose from "mongoose";

// Admin kann alle Fahrten sehen
export async function getFahrten() {
    try {
        // Alle Benutzer aus der Datenbank abrufen und nach Nachnamen sortieren
        const users = await Fahrt.find().sort({ nachname: 1 });

        // Die Ergebnisse zurückgeben
        return users.map(user => user.toObject());
    } catch (error) {
        throw new Error(`Fehler beim Abrufen der Benutzer: ${error.message}`);
    }
}

// User kann seine Fahrten sehen
export async function getUserFahrten(userid: string) {
    try {
        const id = userid;
        const fahrt = await Fahrt.find({ fahrer: id })

        return fahrt.map(fahrt => fahrt.toObject())
    } catch (error) {
        throw new Error(`Fehler beim Abrufen der Fahrten: ${error.message}`)
    }
}

export async function getBeendeteFahrten() {
    try {
        const beendeteFahrten = await Fahrt.find({ beendet: true });
        return beendeteFahrten.map(fahrt => fahrt.toObject());
    } catch (error) {
        throw new Error(`Fehler beim Abrufen der beendeten Fahrten: ${error.message}`);
    }
}

export async function getLaufendeFahrten() {
    try {
        const beendeteFahrten = await Fahrt.find({ beendet: false });
        return beendeteFahrten.map(fahrt => fahrt.toObject());
    } catch (error) {
        throw new Error(`Fehler beim Abrufen der beendeten Fahrten: ${error.message}`);
    }
}

// Admin holt sich die Fahrten von einem User Sinnlos?
// export async function getUserFahrten(user: UserResource) { }

// User erstellt eine Fahrt
export async function createUserFahrt(fahrt: FahrtResource) {
    try {
        const newFahrt = new Fahrt({
            fahrer: fahrt.fahrerid,
            kennzeichen: fahrt.kennzeichen,
            kilometerstand: fahrt.kilometerstand,
            kilometerende: fahrt.kilometerende,
            lenkzeit: fahrt.lenkzeit,
            arbeitszeit: fahrt.arbeitszeit,
            pause: fahrt.pause,
            startpunkt: fahrt.startpunkt,
            endpunkt: fahrt.endpunkt,
            ruhezeit: fahrt.ruhezeit,
            abwesend: fahrt.abwesend,
            beendet: fahrt.beendet,
            totalLenkzeit: fahrt.totalLenkzeit,
            totalArbeitszeit: fahrt.totalArbeitszeit,
            totalPause: fahrt.totalPause,
            totalRuhezeit: fahrt.totalRuhezeit,
            vollname: fahrt.vollname
        });
        const savedFahrt = await newFahrt.save();
        return savedFahrt;
    } catch (error) {
        throw new Error(`Fehler beim Erstellen der Fahrt: ${error.message}`);
    }
}

// Admin kann im nachträglich sachen bearbeiten
export async function updateUserfahrt(fahrtResource: FahrtResource) {
    const { id, lenkzeit, pause, arbeitszeit, ruhezeit, ...update } = fahrtResource;

    const newFahrt = await Fahrt.findByIdAndUpdate(id, update, { new: true });

    if (!newFahrt) {
        throw new Error('Fahrt nicht gefunden');
    }

    // Aktualisiere die Arrays
    if (lenkzeit) {
        await Fahrt.updateOne({ _id: id }, { $push: { lenkzeit: { $each: lenkzeit } } });
    }
    if (pause) {
        await Fahrt.updateOne({ _id: id }, { $push: { pause: { $each: pause } } });
    }
    if (arbeitszeit) {
        await Fahrt.updateOne({ _id: id }, { $push: { arbeitszeit: { $each: arbeitszeit } } });
    }
    if (ruhezeit) {
        const existingRuhezeiten = await Fahrt.findOne({ _id: id }, { ruhezeit: 1 });
        const uniqueRuhezeiten = ruhezeit.filter(newRuhezeit => {
            return !existingRuhezeiten?.ruhezeit.some(existingRuhezeit =>
                new Date(existingRuhezeit.start).getTime() === new Date(newRuhezeit.start).getTime() &&
                new Date(existingRuhezeit.stop).getTime() === new Date(newRuhezeit.stop).getTime()
            );
        });
        if (uniqueRuhezeiten.length > 0) {
            await Fahrt.updateOne({ _id: id }, { $push: { ruhezeit: { $each: uniqueRuhezeiten } } });
        }
    }

    return newFahrt;
}

// Admin kann Fahrten löschen 
export async function deleteFahrt(fahrtid: string) {
    try {
        await Fahrt.findByIdAndDelete(fahrtid);
    } catch (error) {
        throw new Error(`Fehler beim Löschen der Fahrt: ${error.message}`);
    }
}

export async function getFahrtenOfModUsers(userid: string) {
    try {
        // Finde den Benutzer anhand der ID und populiere das modUser-Feld
        const user = await User.findById(userid).populate('modUser.users').exec();
        let fahrten: any = [];

        // Annahme: modUser ist das Array von Objekten, das die Benutzer-IDs enthält
        for (const mod of user.modUser) {
            const userIds = mod.users.split(','); // Splitten der Zeichenkette bei den Kommas

            // Durchlaufe jede Benutzer-ID in userIds
            for (const userId of userIds) {
                // Finde alle Fahrten, bei denen der Benutzer der Fahrer ist
                const userFahrten = await Fahrt.find({ fahrer: userId.trim() }).exec(); // Verwende trim(), um Leerzeichen zu entfernen
                
                // Füge die gefundenen Fahrten zu fahrten hinzu
                fahrten = fahrten.concat(userFahrten);
            }
        }
        
        return fahrten;
    } catch (error) {
        console.error(`Fehler beim Abrufen der Fahrten der Mod-User: ${(error as Error).message}`);
        throw error;
    }
}

