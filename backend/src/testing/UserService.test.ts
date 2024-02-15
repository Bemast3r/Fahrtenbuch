import TestDB from "../Services/TestDb";
import { getUsersFromDB, updateUserAbwesend, changeUser, changeCar, createUser, deleteUser } from "../Services/UserService";
import { UserResource } from "../db/Resources";
import { IUser, User } from "../db/UserModel";
import mongoose, { Types } from "mongoose";

// Mock-Up Daten für die Tests
let user1: IUser & { _id: Types.ObjectId };
let user2: IUser & { _id: Types.ObjectId };

beforeAll(async () => {
    await TestDB.connect();
    // Benutzer für die Tests erstellen
    user1 = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [], abwesend: false });
    user2 = await User.create({ name: "Can", nachname: "Pala", username: "canpala", password: "canna", fahrzeuge: [], abwesend: false });
});

afterAll(async () => {
    await TestDB.clear();
    await TestDB.close();
});

describe("UserService Tests", () => {
    test("getUsers should return an array of UserResource", async () => {
        const foundUsers = await getUsersFromDB();
        expect(foundUsers).toBeDefined();
        expect(Array.isArray(foundUsers)).toBe(true);
        expect(foundUsers.length).toBeGreaterThan(0);
        foundUsers.forEach((user: UserResource) => {
            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("nachname");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("admin");
            expect(user).toHaveProperty("createdAt");
            expect(user).toHaveProperty("fahrzeuge");
            expect(user).toHaveProperty("abwesend");
        });
    });

    test("updateUserAbwesend should update user's abwesend status", async () => {
        const updatedUser = await updateUserAbwesend(user1._id.toString(), true);
        expect(updatedUser.abwesend).toBe(true);
    });

    test("changeUser should update user's details", async () => {
        const updatedUserDetails = {
            ...user2, 
            name: "AUTO" 
        };
        const updatedUser = await changeUser(user2._id.toString(), updatedUserDetails);
        expect(updatedUser.id).toBe(user2._id.toString())
        expect(updatedUser.name).toBe("AUTO");
    });

    test("changeCar should add new car to user's fahrzeuge array", async () => {
        const newCar = { kennzeichen: "ABC123" };
        const updatedUser = await changeCar(user1, newCar);
        const foundCar = updatedUser.fahrzeuge.find(car => car.kennzeichen === newCar.kennzeichen);
        expect(foundCar).toBeDefined();
    });


    test("createUser should create a new user", async () => {
        const newUserResource: UserResource = {
            name: "John",
            nachname: "Doe",
            username: "johndoe",
            admin: false,
            password: "password123"
        };
        const createdUser = await createUser(newUserResource);
        expect(createdUser.id).toBeDefined();
        expect(createdUser.name).toBe(newUserResource.name);
        expect(createdUser.nachname).toBe(newUserResource.nachname);
        expect(createdUser.username).toBe(newUserResource.username);
        expect(createdUser.admin).toBe(newUserResource.admin);
        expect(createdUser.password).toBeUndefined(); // Das Passwort sollte nicht zurückgegeben werden
    });

    test("deleteUser should delete the user", async () => {
        await deleteUser(user1._id.toString());
        const deletedUser = await User.findById(user1._id.toString());
        expect(deletedUser).toBeNull();
    });
});

describe('Negativtests für Benutzerservice-Funktionen', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    })
    afterEach(async () => {
        // Nach jedem Test: Löschen aller Benutzerdaten aus der Testdatenbank
        await User.deleteMany({});
    });

    test('Fehler beim Abrufen der Benutzer aus der Datenbank', async () => {
        // Erstellen Sie absichtlich einen Fehler, indem Sie eine ungültige Datenbankabfrage durchführen
        expect(await getUsersFromDB()).toEqual([]);
    });

    test('Fehler beim Aktualisieren der Abwesenheit des Benutzers', async () => {
        // Erstellen Sie einen Benutzer in der Testdatenbank
        const user: IUser = { name: 'Test', nachname: 'User', username: 'testuser', password: 'password', admin: false, createdAt: new Date(), fahrzeuge: [], abwesend: false };
        await User.create(user);

        // Geben Sie eine ungültige Benutzer-ID an, um einen Fehler beim Aktualisieren der Abwesenheit zu erzwingen
        const userId = String(new mongoose.Types.ObjectId);
        await expect(updateUserAbwesend(userId, true)).rejects.toThrow('Benutzer nicht gefunden');
    });

    test('Fehler beim Ändern des Benutzers', async () => {
        // Geben Sie eine ungültige Benutzer-ID an, um einen Fehler beim Ändern des Benutzers zu erzwingen
        let userId:string = String(new mongoose.Types.ObjectId);
        const userResource = {
            name: 'Test',
            nachname: 'User',
            username: 'testuser',
            admin: false,
            createdAt: new Date(),
            fahrzeuge: [{ datum: Date.now().toLocaleString(), kennzeichen: "AAVVVS"}],
            abwesend: false
        };

        // Erwarten Sie, dass die Änderung des Benutzers mit der ungültigen ID einen Fehler wirft
        await expect(changeUser(userId, userResource)).rejects.toThrow('Benutzer nicht gefunden');
    });
    
    test('Fehler beim Erstellen eines Benutzers', async () => {
        // Erstellen Sie absichtlich einen Benutzer mit fehlenden erforderlichen Attributen, um einen Fehler beim Erstellen zu erzwingen
        const invalidUser: Partial<IUser> = { username: 'testuser', password: 'password' };
        await expect(createUser(invalidUser as IUser)).rejects.toThrow();
    });

    test('Fehler beim Löschen des Benutzers', async () => {
        // Geben Sie eine ungültige Benutzer-ID an, um einen Fehler beim Löschen des Benutzers zu erzwingen
        const invalidUserId = 'invalidUserId';
        await expect(deleteUser(invalidUserId)).rejects.toThrow('Fehler beim Löschen des Benutzers');
    });
});