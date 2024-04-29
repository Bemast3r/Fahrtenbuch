import TestDB from "../TestDatenbank/TestDb";
import { getUsersFromDB, changeUser, createUser, deleteUser, updateUser } from "../../Services/UserService";
import { UserResource } from "../../util/Resources";
import { IUser, User } from "../../Model/UserModel";
import mongoose, { Types } from "mongoose";

// Mock-Up Daten für die Tests
let user1: IUser & { _id: Types.ObjectId };
let user2: IUser & { _id: Types.ObjectId };

beforeAll(async () => {
    await TestDB.connect();
    // Benutzer für die Tests erstellen
})

beforeEach(async () => {
    await User.syncIndexes();
    user1 = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [], abwesend: "false" });
    user2 = await User.create({ name: "Can", nachname: "Pala", username: "canpala", password: "canna", fahrzeuge: [], abwesend: "false" });
});


afterEach(async () => {
    await TestDB.clear()
})

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

    test("changeUser should update user's details", async () => {
        const updatedUserDetails = {
            ...user2,
            name: "AUTO"
        };
        const updatedUser = await changeUser(user2._id.toString(), updatedUserDetails);
        expect(updatedUser.id).toBe(user2._id.toString())
        expect(updatedUser.name).toBe("AUTO");
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

    test('Fehler beim Ändern des Benutzers', async () => {
        // Geben Sie eine ungültige Benutzer-ID an, um einen Fehler beim Ändern des Benutzers zu erzwingen
        let userId: string = String(new mongoose.Types.ObjectId);
        const userResource = {
            name: 'Test',
            nachname: 'User',
            username: 'testuser',
            admin: false,
            createdAt: new Date(),
            fahrzeuge: [{ datum: Date.now().toLocaleString(), kennzeichen: "AAVVVS" }],
            abwesend: "false"
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
test("updateUser should update user's details", async () => {
    const user3 = await createUser(
        {
            name: 'Test',
            nachname: 'User',
            username: 'testuser',
            password: "password",
            admin: false,
            createdAt: new Date(),
            fahrzeuge: [{ datum: Date.now().toLocaleString(), kennzeichen: "AAVVVS" }],
            abwesend: "false"
        })
    const updatedUserDetails = {
        ...user3, 
        name: "UPFATED DUDE",
        abwesend: "true"
    };
    const updatedUser = await updateUser(updatedUserDetails);
    expect(updatedUser.name).toBe("UPFATED DUDE")
    expect(updatedUser.abwesend).toBeTruthy()
});

test("Create a user 3 ", async () => {
    // const updatedUserDetails = {
    //     ...user2, 
    //     name: "AUTO",
    //     abwesend: true
    // };

    const user3 = await createUser(
        {
            name: 'Test',
            nachname: 'User',
            username: 'testuser',
            password: "password",
            admin: false,
            createdAt: new Date(),
            fahrzeuge: [{ datum: Date.now().toLocaleString(), kennzeichen: "AAVVVS" }],
            abwesend: "false"
        })
    expect(user3.id).toBeDefined()
});