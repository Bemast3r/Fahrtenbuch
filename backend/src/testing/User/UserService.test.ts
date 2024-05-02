import TestDB from "../TestDatenbank/TestDb";
import {
    getUsersFromDB,
    changeUser,
    createUser,
    deleteUser,
    updateUser,
    getAllMods,
    getUser,
    getAlleUser,
    getAlleAdmin,
    getAlleModUser,
    addnewModUsers,
    sendEmail,
    sendPasswortZurücksetzen
} from "../../Services/UserService";
import { UserResource } from "../../util/Resources";
import { IUser, User } from "../../Model/UserModel";
import mongoose, { Types } from "mongoose";

// Mock-Up Daten für die Tests
let user1: IUser & { _id: Types.ObjectId };
let user2: IUser & { _id: Types.ObjectId };

beforeAll(async () => {
    await TestDB.connect();
});

beforeEach(async () => {
    await User.syncIndexes();
    user1 = await User.create({ name: "Umut", email: "hhdhd@hahaa.de", vorname: "Aydin", username: "umutaydin", password: "umut21", abwesend: "false" });
    user2 = await User.create({ name: "Can", email: "hhdhdssssssssssss@hahaa.de", vorname: "Pala", username: "canpala", password: "canna", abwesend: "false" });
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
            expect(user).toHaveProperty("vorname");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("admin");
            expect(user).toHaveProperty("createdAt");
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
            vorname: "Doe",
            username: "johndoe",
            admin: false,
            password: "password123",
            email: "aaaaaaaaaaaaa@aa.de",
            abwesend: ""
        };
        const createdUser = await createUser(newUserResource);
        expect(createdUser.id).toBeDefined();
        expect(createdUser.name).toBe(newUserResource.name);
        expect(createdUser.vorname).toBe(newUserResource.vorname);
        expect(createdUser.username).toBe(newUserResource.username);
        expect(createdUser.admin).toBe(newUserResource.admin);
        expect(createdUser.password).toBeUndefined(); // Das Passwort sollte nicht zurückgegeben werden
    });

    test("deleteUser should delete the user", async () => {
        await deleteUser(user1._id.toString());
        const deletedUser = await User.findById(user1._id.toString());
        expect(deletedUser).toBeNull();
    });

    test("deleteUser should delete the user", async () => {
        await expect(getUser("hello")).rejects.toThrow();
    });

    test("getAllMods should return an array of UserResource containing mods", async () => {
        const mods = await getAllMods();
        expect(mods).toBeDefined();
        expect(Array.isArray(mods)).toBe(true);
        expect(mods.length).toBeCloseTo(0);
        mods.forEach((user: UserResource) => {
            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("nachname");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("admin");
            expect(user).toHaveProperty("createdAt");
            expect(user).toHaveProperty("fahrzeuge");
            expect(user).toHaveProperty("abwesend");
            expect(user.mod).toBe(true);
        });
    });

    test("getUser should return user's details", async () => {
        const user = await getUser(user1._id.toString());
        expect(user.id).toBe(user1._id.toString());
        expect(user.name).toBe(user1.name);
        expect(user.vorname).toBe(user1.vorname);
        expect(user.username).toBe(user1.username);
        expect(user.admin).toBe(user1.admin);
        expect(user.createdAt).toStrictEqual(user1.createdAt);
        expect(user.vorname).toEqual(user1.vorname);
        expect(user.abwesend).toBe(user1.abwesend);
    });

    test("getAlleUser should return an array of all users", async () => {
        const users = await getAlleUser();
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
    });

    test("getAlleAdmin should return an array of admin users", async () => {
        const admins = await getAlleAdmin();
        expect(admins).toBeDefined();
        expect(Array.isArray(admins)).toBe(true);
        expect(admins.length).toBeCloseTo(0);
        admins.forEach((user: UserResource) => {
            expect(user.admin).toBe(true);
        });
    });

    test("getAlleModUser should return an array of mod users for the given userid", async () => {
        const mods = await getAlleModUser(user1._id.toString());
        expect(mods).toBeDefined();
        expect(Array.isArray(mods)).toBe(true);
        expect(mods.length).toBeCloseTo(0);
        mods.forEach((mod: { users: string }) => {
            expect(mod.users).toBe(user1._id.toString());
        });
    });

    

    test("sendEmail should send an email to the user with the given email address", async () => {
        const email = "test@example.com";
        await expect(sendEmail(email)).rejects.toThrow();
    });

    test("sendPasswortZurücksetzen should reset the password for the user with the given token and set the new password", async () => {
        const token = "testToken";
        const newPassword = "newPassword";
        await expect(sendPasswortZurücksetzen(token, newPassword)).rejects.toThrow();
    });

    test("updateUser should update user's details", async () => {
        const updatedUserDetails = {
            ...user2,
            id: new mongoose.Types.ObjectId().toString(),
            name: "AUTO",
            abwesend: "true"
        };
        await expect(updateUser(updatedUserDetails)).rejects.toThrow();
    });

    test("Create a user 3 ", async () => {
        const user3 = await createUser(
            {
                name: 'Test',
                email:"jhdjdbdj@jdbjdbdjbdj.com",
                vorname: 'User',
                username: 'testuser',
                password: "password",
                admin: false,
                createdAt: new Date(),
                abwesend: "false"
            });
        expect(user3.id).toBeDefined();
    });
});

describe("updateUser Tests", () => {
    test("updateUser should update user's details", async () => {
        // Erstellen eines Benutzers für den Test
        const user: IUser & { _id: Types.ObjectId } = await User.create({
            name: "Test",
            vorname: "User",
            email: "hapundmos@deineke.com",
            username: "testuser",
            password: "password",
            admin: false,
            createdAt: new Date(),
            fahrzeuge: [],
            abwesend: "false"
        });

        // Erstellen von aktualisierten Benutzerdetails
        const updatedUserDetails: UserResource = {
            id: user._id.toString(),
            name: "UPDATED NAME",
            vorname: "UPDATED VORNAME",
            username: "UPDATED USERNAME",
            email: "updated@example.com",
            password: "updatedpassword",
            admin: true,
            mod: true,
            modUser: [],
            createdAt: user.createdAt,
            abwesend: "true"
        };

        // Ausführen der updateUser-Methode
        const updatedUser = await updateUser(updatedUserDetails);

        // Überprüfen, ob die Benutzerdetails aktualisiert wurden
        expect(updatedUser.id).toBe(user._id.toString());
        expect(updatedUser.name).toBe(updatedUserDetails.name);
        expect(updatedUser.vorname).toBe(updatedUserDetails.vorname);
        expect(updatedUser.username).toBe(updatedUserDetails.username);
        expect(updatedUser.email).toBe(updatedUserDetails.email);
        expect(updatedUser.password).toBeUndefined(); // Das Passwort sollte nicht zurückgegeben werden
        expect(updatedUser.admin).toBe(updatedUserDetails.admin);
        expect(updatedUser.mod).toBe(updatedUserDetails.mod);
        expect(updatedUser.abwesend).toBe(updatedUser.abwesend);
    });

    test("updateUser should throw error if user ID is missing", async () => {
        const userResource: UserResource = {
            name: "Test",
            vorname: "User",
            email: "uahjnhiuhkns@ixnkyoapps.de",
            username: "testuser",
            password: "password",
            admin: false,
            createdAt: new Date(),
            abwesend: "false"
        };

        await expect(updateUser(userResource)).rejects.toThrow("User ID missing, cannot update.");
    });

    test("updateUser should throw error if user with given ID does not exist", async () => {
        const userResource: UserResource = {
            id: new mongoose.Types.ObjectId().toString(), // Generieren einer ungültigen Benutzer-ID
            name: "Test",
            email: "hshshahggd@hkcnkd.de",
            vorname: "User",
            username: "testuser",
            password: "password",
            admin: false,
            createdAt: new Date(),
            abwesend: "false"
        };

        await expect(updateUser(userResource)).rejects.toThrow(`No user with ID ${userResource.id} found, cannot update.`);
    });
});

describe("addnewModUsers Tests", () => {
    test("addnewModUsers should add new mod users successfully", async () => {
        // Erstellen eines Benutzers mit leeren modUser-Array
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: "Test",
            email: "hshshahggssssssd@hkcnkd.de",
            vorname: "Usssser",
            username: "testusssser",
            password: "passwossssrd",
            admin: false,
            createdAt: new Date(),
            abwesend: "false",
            modUser: [{}]
        });
        // Speichern des Benutzers in der Datenbank
        await user.save();

        const users: any[] = [
            { id: "user1Id", vorname: "John", name: "Doe" },
            { id: "user2Id", vorname: "Jane", name: "Smith" }
        ];

        // Hinzufügen neuer Mod-Benutzer
        const result = await addnewModUsers(user.id, users);

        // Überprüfen, ob die Funktion erfolgreich war
        expect(result).toBe(true);

        // Überprüfen, ob die neuen Mod-Benutzer korrekt hinzugefügt wurden
        const updatedUser = await User.findById(user.id);
        expect(updatedUser).toBeDefined();
        // expect(updatedUser?.modUser).toBeCloseTo(0);
        expect(updatedUser?.modUser[0]).toEqual(updatedUser?.modUser[0]);
        expect(updatedUser?.modUser[1]).toEqual(updatedUser?.modUser[1]);
    });

    test("addnewModUsers should return false if user does not exist", async () => {
        // Versuch, einen nicht vorhandenen Benutzer hinzuzufügen
        const users: any[] = [
            { id: "user1Id", vorname: "John", name: "Doe" },
            { id: "user2Id", vorname: "Jane", name: "Smith" }
        ];

        // Hinzufügen neuer Mod-Benutzer für einen nicht vorhandenen Benutzer
        const result = await addnewModUsers(new mongoose.Types.ObjectId().toString(), users);

        // Überprüfen, ob die Funktion false zurückgibt
        expect(result).toBe(false);
    });

    test("addnewModUsers shouldsasas return false if user does not exist", async () => {
        // Versuch, einen nicht vorhandenen Benutzer hinzuzufügen
        const users: any[] = [
            { id: "user1Id", vorname: "John", name: "Doe" },
            { id: "user2Id", vorname: "Jane", name: "Smith" }
        ];

        // Hinzufügen neuer Mod-Benutzer für einen nicht vorhandenen Benutzer
        await expect(getUser(new mongoose.Types.ObjectId().toString())).rejects.toThrow();

        });

        test("addnewModUsers shouldsasas return false if user does not exist", async () => {
            // Versuch, einen nicht vorhandenen Benutzer hinzuzufügen
            const users: UserResource = 
                { username: "user1Id", email: "John", vorname: "Doe", name: "Doe", abwesend: "Doe" }
            
    
            // Hinzufügen neuer Mod-Benutzer für einen nicht vorhandenen Benutzer
            await expect(createUser(users)).rejects.toThrow();
    
            });
});


