import dotenv from "dotenv";
dotenv.config();

import { UserResource } from "../db/Resources";
import { IUser, User } from "../db/UserModel";
import { Types } from "mongoose"

import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function mapUserToResource(user: IUser & { _id: Types.ObjectId; }): Promise<UserResource> {
    const userResource: UserResource = {
        id: user._id.toString(),
        name: user.name,
        nachname: user.nachname,
        username: user.username,
        email: user.email,
        admin: user.admin,
        createdAt: user.createdAt,
        fahrzeuge: user.fahrzeuge,
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
        name: userResource.name,
        nachname: userResource.nachname,
        username: userResource.username,
        email: userResource.email,
        password: userResource.password,
        admin: userResource.admin
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
    if (userResource.name) user.name = userResource.name;
    if (userResource.nachname) user.nachname = userResource.nachname;
    if (userResource.username) user.username = userResource.username;
    if (userResource.email) user.email = userResource.email;
    if (userResource.password) user.password = userResource.password;
    if (typeof userResource.admin === 'boolean') user.admin = userResource.admin;
    if (userResource.abwesend) user.abwesend = userResource.abwesend;

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
            subject: 'Passwort zurücksetzen',
            text: `Um Ihr Passwort zurückzusetzen, klicken Sie auf diesen Link: http://localhost:3000/passwort-vergessen/${token}`
        });
    } catch (error: any) {
        throw new Error(`Fehler beim Senden der E-Mail: ${(error as Error).message}`);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error: any) {
        throw new Error(`Fehler beim Löschen des Benutzers: ${(error as Error).message}`);
    }
}
