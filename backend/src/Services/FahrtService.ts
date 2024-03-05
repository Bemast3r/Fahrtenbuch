import { Fahrt } from "../db/FahrtModel";
import { FahrtResource, UserResource } from "../db/Resources";

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
            ruhezeit: fahrt.ruhezeit
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
        await Fahrt.updateOne({ _id: id }, { $push: { ruhezeit: { $each: ruhezeit } } });
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