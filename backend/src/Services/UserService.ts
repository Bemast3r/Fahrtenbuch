import dotenv from "dotenv";
dotenv.config();
import { UserResource } from "../util/Resources";
import { IUser, User } from "../Model/UserModel";
import { Types } from "mongoose"
import { hash } from "bcryptjs";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function mapUserToResource(user: IUser & { _id: Types.ObjectId; }): Promise<UserResource> {
    const userResource: UserResource = {
        id: user._id.toString(),
        vorname: user.vorname,
        name: user.name,
        username: user.username,
        email: user.email,
        admin: user.admin,
        createdAt: user.createdAt,
        mod: user.mod,
        modUser: user.modUser,
        abwesend: user.abwesend
    };
    return userResource;
}

export async function getUser(userid: string) {
    const user = await User.findById(userid).exec();
    if (!user) {
        throw new Error(`Kein User mit ID ${userid} gefunden.`);
    }
    const mapped = await mapUserToResource(user);
    return mapped
}


export async function getAllMods() {
    const mapped = await User.find({ mod: true }).exec();
    return mapped
}

export async function getUsersFromDB(): Promise<UserResource[]> {
    const users = await User.find().sort({ nachname: 1 });
    if (!users) {
        throw new Error(`Keine User gefunden.`);
    }
    const userResources = await Promise.all(users.map(user => mapUserToResource(user)));
    return userResources;
}

export async function createUser(userResource: UserResource): Promise<UserResource> {
    const user = await User.create({
        vorname: userResource.vorname,
        name: userResource.name,
        username: userResource.username,
        email: userResource.email,
        password: userResource.password,
        admin: userResource.admin,
        mod: userResource.mod,
        modUser: userResource.modUser
    });

    if (!user) {
        throw new Error(`Keine User erstellen können.`);
    }
    const mapped = await mapUserToResource(user)
    return mapped
}

export async function updateUser(userResource: UserResource): Promise<UserResource> {
    if (!userResource.id) {
        throw new Error("User ID missing, cannot update.");
    }
    const user = await User.findById(userResource.id).exec();
    if (!user) {

        throw new Error(`No user with ID ${userResource.id} found, cannot update.`);
    }

    if (userResource.vorname) user.vorname = userResource.vorname;
    if (userResource.name) user.name = userResource.name;
    if (userResource.username) user.username = userResource.username;
    if (userResource.email) user.email = userResource.email;
    if (userResource.password) user.password = userResource.password;
    if (userResource.modUser) user.modUser = (userResource.modUser);
    if (typeof userResource.admin === 'boolean') user.admin = userResource.admin;
    if (typeof userResource.mod === 'boolean') user.mod = userResource.mod;
    const savedUser = await user.save();
    const mapped = await mapUserToResource(savedUser)
    return mapped
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
        const x = await user.save();

        // Geben Sie die aktualisierten Benutzerdetails zurück
        const mapped = await mapUserToResource(x)
        return mapped
    } catch (error: any) {
        throw new Error(`Fehler beim Ändern des Benutzers: ${(error as Error).message}`);
    }
}

export async function sendEmail(email: string): Promise<void> {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            throw new Error('Benutzer mit dieser E-Mail-Adresse existiert nicht.');
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'SKM Account - Passwort Zurücksetzen',
            text: `Um Ihr Passwort für Ihren SKM-Account zurückzusetzen, klicken Sie bitte auf diesen Link: \n \n http://localhost:3000/passwort-zuruecksetzen/${token}`
        });
    } catch (error: any) {
        throw new Error(`Fehler beim Senden der E-Mail: ${(error as Error).message}`);
    }
}

export async function sendPasswortZurücksetzen(token: string, newPassword: string): Promise<void> {
    try {
        // Überprüfe, ob das Token gültig ist
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decodedToken;

        const hashedPassword = await hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
    } catch (error) {
        throw new Error(`Fehler beim Zurücksetzen des Passworts: ${error.message}`);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error: any) {
        throw new Error(`Fehler beim Löschen des Benutzers: ${(error as Error).message}`);
    }
}

export async function getAlleUser(): Promise<UserResource[]> {
    try {
        const users = await getUsersFromDB();
        return users;
    } catch (error) {
        throw new Error(`Fehler beim Abrufen aller Benutzer: ${error.message}`);
    }
}

export async function getAlleAdmin(): Promise<UserResource[]> {
    try {
        const users = await getUsersFromDB();
        const admins = users.filter(user => user.admin);
        return admins;
    } catch (error) {
        throw new Error(`Fehler beim Abrufen aller Admin-Benutzer: ${error.message}`);
    }
}

export async function getAlleModUser(userid: string): Promise<{ users: string; }[]> {
    try {
        // Suchen Sie den Benutzer basierend auf der übergebenen Benutzer-ID und laden Sie die Mods
        const user = await User.findById(userid).populate('modUser.users').exec();

        // Überprüfen Sie, ob der Benutzer gefunden wurde
        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Extrahieren Sie die Mods aus dem gefundenen Benutzer
        const mods = user.modUser;
        // Rückgabe der gefundenen Mods
        return mods;
    } catch (error) {
        throw new Error(`Fehler beim Abrufen aller Mods-Benutzer: ${error.message}`);
    }
}


export async function addnewModUsers(userid: string, users: UserResource[]): Promise<boolean> {
    try {
        const user = await User.findById(userid).exec()
        if (!user) {
            throw new Error("User existiert nicht.")
        }
        const modUserIds = users.map(user2 => user.modUser.push({ users: user2.id, name: user2.vorname + " " + user2.name }));
        // const modUserObjects = modUserIds.map(userId => ({ users: userId }));
        // user.modUser.push(...modUserIds);
        await user.save();
        return true; // Erfolg
    } catch (error) {
        console.error(`Fehler beim Hinzufügen von Mod-Usern: ${(error as Error).message}`);
        return false; // Misserfolg
    }
}

