import { Fahrt } from "db/FahrtModel";
import { UserResource } from "db/Resources";

// // Admin kann alle Fahrten sehen.
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
// // User kann seine Fahrten sehen
export async function getMeineFahrten(user: UserResource) { }
// // Admin holt sich die Fahrten von einem User
export async function getUserFahrten(user: UserResource) { }
// // User erstellt eine Fahrt.
// export const createFahrt = async (req, res) => {}
export async function createUserFahrt(user: UserResource) { }
// // Admin kann im nachträglich sachen bearbeiten. 
export async function updateUserfahrt(user: UserResource) { }
// // Admin kann Fahrten löschen 
export async function deleteFahrt(userid: string) { }
