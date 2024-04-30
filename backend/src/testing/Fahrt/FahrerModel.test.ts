import { Fahrt, IFahrt } from "../../Model/FahrtModel";
import { IUser, User } from "../../Model/UserModel";
import { Types } from "mongoose";
import TestDB from "../TestDatenbank/TestDb";

let userUmut: IUser & { _id: Types.ObjectId; };
let fahrermo: IFahrt & { _id: Types.ObjectId; };

beforeAll(async () => await TestDB.connect());
beforeEach(async () => {
    userUmut = await User.create({
        name: "Umut",
        vorname: "Aydin",
        email: "idvshgis@idgfvi.de",
        username: "umutaydin",
        password: "umut21",
        fahrzeuge: [{ datum: new Date(), kennzeichen: "ABC123" }],
        abwesend: false
    });

    fahrermo = await Fahrt.create({
        fahrer: userUmut._id,
        kennzeichen: "test",
        kilometerstand: 200,
        kilometerende: 210,
        lenkzeit: [new Date()],
        pause: [new Date()],
        arbeitszeit: [new Date()],
        startpunkt: "Start",
        endpunkt: "Ende",
        beendet: true,
        ruhezeit: [{ start: new Date(), stop: new Date() }],
        abwesend: "Urlaub",
        totalLenkzeit: 5,
        totalArbeitszeit: 3,
        totalPause: 2,
        totalRuhezeit: 1
    });
});

afterEach(async () => await TestDB.clear());
afterAll(async () => await TestDB.close());

test("Benutzer erstellen und speichern", async () => {
    const newUser = await User.create({
        name: "Max",
        vorname: "Mustermann",
        email: "bivbedh@ivbiwbvi.com",
        username: "maxm",
        password: "max123",
        abwesend: false
    });
    const createdUser = await newUser.save();

    expect(createdUser._id).toBeDefined();
    expect(createdUser.name).toBe("Max");
    expect(createdUser.vorname).toBe("Mustermann");
    expect(createdUser.username).toBe("maxm");
    expect(createdUser.password).toBeDefined();
    expect(createdUser.admin).toBeFalsy();
    expect(createdUser.createdAt).toBeDefined();
    expect(createdUser.abwesend).toEqual(newUser.abwesend);
});

test("Fahrt erstellt", async () => {
    expect(fahrermo._id).toBeDefined();
    expect(fahrermo.lenkzeit).toHaveLength(1);
    expect(fahrermo.kilometerende).toBe(210);
    expect(fahrermo.createdAt).toBeDefined();
    expect(fahrermo.kennzeichen).toEqual("test");
    expect(fahrermo.kilometerstand).toBe(200);
    expect(fahrermo.pause).toHaveLength(1);
    expect(fahrermo.arbeitszeit).toHaveLength(1);
    expect(fahrermo.startpunkt).toBe("Start");
    expect(fahrermo.endpunkt).toBe("Ende");
    expect(fahrermo.beendet).toBeTruthy();
    expect(fahrermo.ruhezeit).toHaveLength(1);
    expect(fahrermo.abwesend).toBe("Urlaub");
    expect(fahrermo.totalLenkzeit).toBe(5);
    expect(fahrermo.totalArbeitszeit).toBe(3);
    expect(fahrermo.totalPause).toBe(2);
    expect(fahrermo.totalRuhezeit).toBe(1);
});
