import { User, IUser } from "../../Model/UserModel";
import mongoose, { Types } from "mongoose";
import TestDB from "../TestDatenbank/TestDb";
import { Fahrt, IFahrt } from "../../Model/FahrtModel";
import { createUserFahrt, deleteFahrt, getFahrten, getUserFahrten, updateUserfahrt } from "../../Services/FahrtService";

let Fahrer: IUser & { _id: Types.ObjectId };
let fahrt: IFahrt & { _id: Types.ObjectId };

beforeAll(async () => {
    await TestDB.connect();
});

beforeEach(async () => {
    Fahrer = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [], abwesend: false });
    fahrt = await Fahrt.create({
        fahrer: Fahrer._id,
        kennzeichen: "ABC123",
        kilometerstand: 100,
        kilometerende: 200,
        lenkzeit: 8,
        arbeitszeit: 10,
        pause: 2
    });
});

afterEach(async () => {
    await TestDB.clear();
});

afterAll(async () => {
    await TestDB.close();
});

describe("getFahrten Tests", () => {
    it("sollte alle Fahrten abrufen", async () => {
        const fahrten = await getFahrten();
        expect(fahrten.length).toBeGreaterThan(0);
    });
});

describe("getMeineFahrten Tests", () => {
    it("sollte die Fahrten des Benutzers abrufen", async () => {
        const meineFahrten = await getUserFahrten(Fahrer._id.toString() );
        expect(meineFahrten.length).toBeGreaterThan(0);
    });
});

describe("createUserFahrt Tests", () => {
    it("sollte eine Fahrt erstellen", async () => {
        const fahrtResource = {
            fahrerid: Fahrer._id.toString(),
            kennzeichen: "XYZ789",
            kilometerstand: 200,
            kilometerende: 300,
            lenkzeit: 7,
            arbeitszeit: 9,
            pause: 1,
            startpunkt: "Berlin"
        };
        const savedFahrt = await createUserFahrt(fahrtResource);
        expect(savedFahrt).toBeDefined();
    });
});

describe("updateUserfahrt Tests", () => {
    it("sollte eine Fahrt aktualisieren", async () => {
        const updatedFahrtResource = {
            id: fahrt._id.toString(),
            fahrerid: String(new mongoose.Types.ObjectId),
            kennzeichen: "DEF456",
            kilometerstand: 300,
            kilometerende: 400,
            lenkzeit: 6,
            arbeitszeit: 8,
            pause: 2
        };
        await updateUserfahrt(updatedFahrtResource);
        const updatedFahrt = await Fahrt.findById(fahrt._id);
        expect(updatedFahrt.kennzeichen).toBe("DEF456");
        expect(updatedFahrt.kilometerstand).toBe(300);
        expect(updatedFahrt.kilometerende).toBe(400);
        expect(updatedFahrt.lenkzeit).toBe(6);
        expect(updatedFahrt.arbeitszeit).toBe(8);
        expect(updatedFahrt.pause).toBe(2);
    });
});

describe("deleteFahrt Tests", () => {
    it("sollte eine Fahrt löschen", async () => {
        await deleteFahrt(fahrt._id.toString());
        const deletedFahrt = await Fahrt.findById(fahrt._id);
        expect(deletedFahrt).toBeNull();
    });
});
