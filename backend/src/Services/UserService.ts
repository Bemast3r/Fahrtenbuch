import { UserResource } from "../db/Resources";
import { IUser, User } from "../db/UserModel";
import { Types } from "mongoose"

async function mapUserToResource(user: IUser & { _id: Types.ObjectId; }): Promise<UserResource> {
    const userResource: UserResource = {
        id: user._id.toString(),
        name: user.name,
        nachname: user.nachname,
        username: user.username,
        admin: user.admin,
        createdAt: user.createdAt,
        fahrzeuge: user.fahrzeuge,
        abwesend: user.abwesend
    };
    return userResource;
}

export async function getUsersFromDB(): Promise<UserResource[]> {
    const users = await User.find().sort({ nachname: 1 });
    const userResources = await Promise.all(users.map(user => mapUserToResource(user)));
    return userResources;
}

export async function updateUserAbwesend(userId: string, abwesend: boolean): Promise<UserResource> {
    try {
        const user = await User.findById(userId).exec();
        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }
        user.abwesend = abwesend;
        await user.save();
        return mapUserToResource(user);
    } catch (error) {
        throw new Error(`Fehler beim Aktualisieren der Abwesenheit des Benutzers: ${error.message}`);
    }
}

export async function changeUser(userId: string, updatedUserFields: Partial<UserResource>): Promise<UserResource> {
    try {
        // Suchen Sie den Benutzer anhand der ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Aktualisieren Sie nur die übergebenen Felder
        Object.assign(user, updatedUserFields);

        // Speichern Sie die Änderungen in der Datenbank
        await user.save();

        // Geben Sie die aktualisierten Benutzerdetails zurück
        return mapUserToResource(user);
    } catch (error) {
        throw new Error(`Fehler beim Ändern des Benutzers: ${error.message}`);
    }
}


export async function changeCar(user: UserResource, newCar: { kennzeichen: string }): Promise<UserResource> {
    try {
        const userdb = await User.findById(user.id).exec();
        if (!userdb) {
            throw new Error('Benutzer nicht gefunden');
        }
        if (!userdb.fahrzeuge) {
            userdb.fahrzeuge = [];
        }
        // Setze das aktuelle Datum und die aktuelle Uhrzeit für das neue Fahrzeug
        userdb.fahrzeuge.push({ datum: new Date().toLocaleString(), kennzeichen: newCar.kennzeichen });
        await userdb.save();
        return mapUserToResource(userdb);
    } catch (error) {
        throw new Error(`Fehler beim Ändern des Autos: ${error.message}`);
    }
}


export async function createUser(userResource: UserResource): Promise<UserResource> {
    const user = await User.create({
        name: userResource.name,
        nachname: userResource.nachname,
        username: userResource.username,
        admin: userResource.admin,
        password: userResource.password
    });
    return mapUserToResource(user);
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error(`Fehler beim Löschen des Benutzers: ${error.message}`);
    }
}
