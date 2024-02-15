import { UserResource } from "db/Resources";
import { User } from "db/UserModel";

// Admin kann alle User holen
export async function getUsers(): Promise<UserResource[]> {
    try {
        // Alle Benutzer aus der Datenbank abrufen und nach Nachnamen sortieren
        const users = await User.find().sort({ nachname: 1 });

        // Die Ergebnisse zurückgeben
        return users.map(user => user.toObject());
    } catch (error) {
        throw new Error(`Fehler beim Abrufen der Benutzer: ${error.message}`);
    }
}

export async function updateUserAbwesend(userId: string, abwesend: boolean): Promise<UserResource> {
    try {
        // Finde den Benutzer in der Datenbank anhand der ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Aktualisiere den Abwesenheitsstatus des Benutzers
        user.abwesend = abwesend;

        // Speichere die Änderungen in der Datenbank
        await user.save();
        return user.toObject()
    } catch (error) {
        throw new Error(`Fehler beim Aktualisieren der Abwesenheit des Benutzers: ${error.message}`);
    }
}

// Admin kann user ändern
export async function changeUser(userId: string, userResource: UserResource): Promise<UserResource> {
    try {
        // Aktualisiere den Benutzer in der Datenbank
        const updatedUser = await User.findByIdAndUpdate(userId, userResource, { new: true });
        // Überprüfe, ob der Benutzer gefunden und aktualisiert wurde
        if (!updatedUser) {
            throw new Error('Benutzer nicht gefunden');
        }

        return updatedUser.toObject();
    } catch (error) {
        throw new Error(`Fehler beim Ändern des Benutzers: ${error.message}`);
    }
}


// User kann sein Auto wechseln
export async function changeCar(user: UserResource, newCar: { datum: Date; kennzeichen: string }): Promise<UserResource> {
    try {
        // Finde den Benutzer in der Datenbank
        const userdb = await User.findById(user.id).exec();
        if (!userdb) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Füge das neue Auto zum Array der Fahrzeuge hinzu
        if (!userdb.fahrzeuge) {
            userdb.fahrzeuge = [];
        }
        userdb.fahrzeuge.push(newCar);

        // Speichere die Änderungen in der Datenbank
        await userdb.save();

        // Gib den aktualisierten Benutzer zurück
        return userdb.toObject();
    } catch (error) {
        throw new Error(`Fehler beim Ändern des Autos: ${error.message}`);
    }
}

// Erstelle User nur admin in Router einstellen.
export async function createUser(userResource: UserResource): Promise<UserResource> {
    const user = await User.create({
        name: userResource.name,
        nachname: userResource.nachname,
        username: userResource.username,
        admin: userResource.admin,
        password: userResource.password
    });
    return { id: user.id, name: user.name, nachname: user.nachname, username: user.username, admin: user.admin! }
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        // Benutzer in der Datenbank anhand der ID löschen
        await User.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error(`Fehler beim Löschen des Benutzers: ${error.message}`);
    }
}