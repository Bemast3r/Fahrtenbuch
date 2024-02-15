import { UserResource } from "db/Resources";
import { IUser, User } from "db/UserModel";
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

export async function getUsers(): Promise<UserResource[]> {
    try {
        const users = await User.find().sort({ nachname: 1 });
        const userResources = await Promise.all(users.map(user => mapUserToResource(user)));
        return userResources;
    } catch (error) {
        throw new Error(`Fehler beim Abrufen der Benutzer: ${error.message}`);
    }
}

export async function updateUserAbwesend(userId: string, abwesend: boolean): Promise<UserResource> {
    try {
        const user = await User.findById(userId);
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

export async function changeUser(userId: string, userResource: UserResource): Promise<UserResource> {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, userResource, { new: true });
        if (!updatedUser) {
            throw new Error('Benutzer nicht gefunden');
        }
        return mapUserToResource(updatedUser);
    } catch (error) {
        throw new Error(`Fehler beim Ändern des Benutzers: ${error.message}`);
    }
}

export async function changeCar(user: UserResource, newCar: { datum: Date; kennzeichen: string }): Promise<UserResource> {
    try {
        const userdb = await User.findById(user.id).exec();
        if (!userdb) {
            throw new Error('Benutzer nicht gefunden');
        }
        if (!userdb.fahrzeuge) {
            userdb.fahrzeuge = [];
        }
        userdb.fahrzeuge.push(newCar);
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
