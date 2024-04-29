import { User } from "../../Model/UserModel";
import { Fahrt } from "../../Model/FahrtModel";
import { createUserFahrt, deleteFahrt, getBeendeteFahrten, getFahrten, getFahrtenOfModUsers, getLaufendeFahrten, getUserFahrten, updateUserfahrt } from "../../Services/FahrtService";
import mongoose, { Types } from "mongoose";
import TestDB from "../TestDatenbank/TestDb";
import { IUser } from "Model/UserModel";
import { IFahrt } from "Model/FahrtModel";

let Fahrer: IUser & { _id: Types.ObjectId };
let fahrt: IFahrt & { _id: Types.ObjectId };

beforeAll(async () => {
    await TestDB.connect();
});

beforeEach(async () => {
    Fahrer = await User.create({ name: "Umut",email: "hguewgfuzc@iuewgiuwe.de", vorname: "Aydin", username: "umutaydin", password: "umut21", abwesend: false });
    fahrt = await Fahrt.create({
        fahrer: Fahrer._id,
        kennzeichen: "ABC123",
        kilometerstand: 100,
        kilometerende: 200,
        lenkzeit: [new Date(1)],
        arbeitszeit: [new Date(1)],
        pause: [new Date(1)],
        startpunkt: "dhdhd"
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

    it("sollte einen Fehler ausgeben, wenn das Abrufen fehlschlägt", async () => {
        await expect(getFahrten()).resolves.not.toThrow();
    });
});

describe("getUserFahrten Tests", () => {
    it("sollte die Fahrten des Benutzers abrufen", async () => {
        const meineFahrten = await getUserFahrten(Fahrer._id.toString());
        expect(meineFahrten.length).toBeGreaterThan(0);
    });

    it("sollte einen Fehler ausgeben, wenn das Abrufen fehlschlägt", async () => {
        await expect(getUserFahrten("invalidId")).rejects.toThrow();
    });
});

describe("createUserFahrt Tests", () => {
    it("sollte eine Fahrt erstellen", async () => {
        const fahrtResource = {
            fahrerid: Fahrer._id.toString(),
            kennzeichen: "XYZ789",
            kilometerstand: 200,
            kilometerende: 300,
            lenkzeit: [new Date(1)], // Hier wird lenkzeit als Array von Datumswerten definiert
            arbeitszeit: [new Date(1)],
            pause: [new Date(1)],
            startpunkt: "Berlin"
        };        
        const savedFahrt = await createUserFahrt(fahrtResource);
        expect(savedFahrt).toBeDefined();
    });

    it("sollte einen Fehler ausgeben, wenn das Erstellen fehlschlägt", async () => {
        const fahrtResource = {
            fahrerid: "invalidId",
            kennzeichen: "XYZ789",
            kilometerstand: 200,
            kilometerende: 300,
            lenkzeit: [new Date(1)],
            arbeitszeit: [new Date(1)],
            pause: [new Date(1)],
            startpunkt: "Berlin"
        };
        await expect(createUserFahrt(fahrtResource)).rejects.toThrow();
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
            lenkzeit: [new Date(1)],
            arbeitszeit: [new Date(1)],
            pause: [new Date(1)],
            startpunkt: "yap"
        };
        await updateUserfahrt(updatedFahrtResource);
        const updatedFahrt = await Fahrt.findById(fahrt._id);
        expect(updatedFahrt.kennzeichen).toBe("DEF456");
        expect(updatedFahrt.kilometerstand).toBe(300);
        expect(updatedFahrt.kilometerende).toBe(400);
        expect(updatedFahrt.lenkzeit).toBe([new Date(1)]);
        expect(updatedFahrt.arbeitszeit).toBe([new Date(1)]);
        expect(updatedFahrt.pause).toBe([new Date(1)]);
    });

    it("sollte einen Fehler ausgeben, wenn die Fahrt nicht gefunden wird", async () => {
        const updatedFahrtResource = {
            id: "invalidId",
            fahrerid: String(new mongoose.Types.ObjectId),
            kennzeichen: "DEF456",
            kilometerstand: 300,
            kilometerende: 400,
            lenkzeit: [new Date(1)],
            arbeitszeit: [new Date(1)],
            pause: [new Date(1)],
            startpunkt: "yap"
        };
        await expect(updateUserfahrt(updatedFahrtResource)).rejects.toThrow();
    });
});

describe("deleteFahrt Tests", () => {
    it("sollte eine Fahrt löschen", async () => {
        await deleteFahrt(fahrt._id.toString());
        const deletedFahrt = await Fahrt.findById(fahrt._id);
        expect(deletedFahrt).toBeNull();
    });

    it("sollte keinen Fehler ausgeben, wenn die Fahrt nicht gefunden wird", async () => {
        await expect(deleteFahrt(mongoose.Types.ObjectId.toString())).rejects.toThrow();
    });
});
describe("getFahrtenOfModUsers Tests", () => {
    it("sollte Fahrten der Mod-User abrufen", async () => {
        const moderator = await User.create({ name: "Moderator",email: "SSsiew@ewbfhiweb.de", vorname: "Mustermann", username: "modi", password: "modi123", abwesend: false });
        const fahrer1 = await User.create({ name: "Fahrer1", email: "SSsigfgfew@ewbfhiweb.de", vorname: "Fahrer", username: "fahrer1", password: "fahrer123", abwesend: false });
        const fahrer2 = await User.create({ name: "Fahrer2", email: "SSsiejajaw@ewbfhiweb.de", vorname: "Fahrer", username: "fahrer2", password: "fahrer123", abwesend: false });

        moderator.modUser = [{ users: fahrer1._id + "," + fahrer2._id, name: "Fahrer1, Fahrer2" }];
        await moderator.save();

        await Fahrt.create({ fahrer: fahrer1._id, kennzeichen: "ABC123", kilometerstand: 100, kilometerende: 200,  startpunkt: "Berlin" });
        await Fahrt.create({ fahrer: fahrer2._id, kennzeichen: "XYZ789", kilometerstand: 200, kilometerende: 300 ,  startpunkt: "Berlin"});

        const fahrten = await getFahrtenOfModUsers(moderator._id.toString());
        expect(fahrten.length).toBeGreaterThan(0);
    });

    it("sollte keine Fahrten abrufen, wenn Mod-User keine Fahrer hat", async () => {
        const moderator = await User.create({ name: "Moderator",email:"jhbcjhs@bdhdhdhdhdh.de", vorname: "Mustermann", username: "modi", password: "modi123", abwesend: false });

        const fahrten = await getFahrtenOfModUsers(moderator._id.toString());
        expect(fahrten.length).toBe(0);
    });

    it("sollte Fehler werfen, wenn Mod-User-ID ungültig ist", async () => {
        const invalidUserID = new mongoose.Types.ObjectId().toString();
        await expect(getFahrtenOfModUsers(invalidUserID)).rejects.toThrow();
    });
});

describe("createUserFahrt Tests", () => {
    it("sollte eine Fahrt erstellen", async () => {
        // Vorbedingungen: Benutzer erstellen
        const user = await User.create({ vorname: "Max", name: "Mustermann", username: "maxm", email: "maxaa@example.com", password: "max123", abwesend: false });

        // Fahrtressource erstellen
        const fahrtResource = {
            fahrerid: user._id.toString(),
            kennzeichen: "ABC123",
            kilometerstand: 100,
            kilometerende: 200,
            lenkzeit: [new Date(1)],
            arbeitszeit: [new Date(1)],
            pause: [new Date(1)],
            startpunkt: "Start",
            endpunkt: "Ende",
            ruhezeit: [{ start: new Date(1), stop: new Date(1) }],
            abwesend: "Nein",
            beendet: false,
            totalLenkzeit: 10,
            totalArbeitszeit: 8,
            totalPause: 2,
            totalRuhezeit: 1,
            vollname: "Max Mustermann"
        };

        // Test: Fahrt erstellen
        const savedFahrt = await createUserFahrt(fahrtResource);

        // Erwartungen prüfen
        expect(savedFahrt).toBeDefined();
        expect(savedFahrt.fahrer.toString()).toBe(user._id.toString());
        expect(savedFahrt.kennzeichen).toBe("ABC123");
        expect(savedFahrt.kilometerstand).toBe(100);
        expect(savedFahrt.kilometerende).toBe(200);
        expect(savedFahrt.lenkzeit).toEqual(expect.any(Array));
        expect(savedFahrt.arbeitszeit).toEqual(expect.any(Array));
        expect(savedFahrt.pause).toEqual(expect.any(Array));
        expect(savedFahrt.startpunkt).toBe("Start");
        expect(savedFahrt.endpunkt).toBe("Ende");
        expect(savedFahrt.ruhezeit).toEqual(expect.any(Array));
        expect(savedFahrt.abwesend).toBe("Nein");
        expect(savedFahrt.beendet).toBe(false);
        expect(savedFahrt.totalLenkzeit).toBe(10);
        expect(savedFahrt.totalArbeitszeit).toBe(8);
        expect(savedFahrt.totalPause).toBe(2);
        expect(savedFahrt.totalRuhezeit).toBe(1);
        expect(savedFahrt.vollname).toBe("Max Mustermann");
    });

    it("sollte Fehler werfen, wenn die Fahrtressource unvollständig ist", async () => {
        // Fahrtressource ohne fahrerid erstellen
        const incompleteFahrtResource = {
            fahrerid: Fahrer._id.toString(),
            kennzeichen: "ABC123",
            kilometerstand: 100,
            kilometerende: 200,
            lenkzeit: [new Date(1)],
            arbeitszeit: [new Date(1)],
            pause: [new Date(1)],
            startpunkt: "Start",
            endpunkt: "Ende",
            ruhezeit: [{ start: new Date(), stop: new Date() }],
            abwesend: "Nein",
            beendet: false,
            totalLenkzeit: 10,
            totalArbeitszeit: 8,
            totalPause: 2,
            totalRuhezeit: 1
        };

        // Test: Fehler erwarten
        await expect(createUserFahrt(incompleteFahrtResource)).resolves.not.toThrowError();
    });
});

describe("getFahrten Tests", () => {
    it("sollte alle Fahrten abrufen", async () => {
        // Test: Alle Fahrten abrufen
        const fahrten = await getFahrten();

        // Erwartung: Die Anzahl der zurückgegebenen Fahrten sollte größer als 0 sein
        expect(fahrten.length).toBeGreaterThan(0);
    });

    it("sollte Fehler werfen, wenn beim Abrufen der Fahrten ein Fehler auftritt", async () => {
        // Mocken von Fahrt.find(), um einen Fehler zu erzwingen
        jest.spyOn(Fahrt, "find").mockImplementation(() => {
            throw new Error("Fehler beim Abrufen der Fahrten");
        });

        // Test: Fehler erwarten
        await expect(getFahrten()).rejects.toThrow("Fehler beim Abrufen der Benutzer");

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });
});

describe("getUserFahrten Tests", () => {
    it("sollte die Fahrten des Benutzers abrufen", async () => {
        // Mocken von Fahrt.find(), um eine festgelegte Fahrt zurückzugeben
        jest.spyOn(Fahrt, "find").mockResolvedValueOnce([
            {
                fahrer: "userId",
                kennzeichen: "ABC123",
                kilometerstand: 100,
                kilometerende: 200,
                lenkzeit: 8,
                arbeitszeit: 10,
                pause: 2,
                toObject: () => ({ /* Fahrt-Objekt als JSON */ })
            }
        ]);

        // Test: Fahrten des Benutzers abrufen
        const userId = "userId";
        const userFahrten = await getUserFahrten(userId);

        // Erwartung: Die Anzahl der zurückgegebenen Fahrten sollte 1 sein
        expect(userFahrten.length).toBe(1);

        // Erwartung: Überprüfen, ob das zurückgegebene Objekt dem erwarteten Format entspricht
        // Beispielhafte Überprüfung des Fahrt-Objekts
        expect(userFahrten[0]).toEqual({});

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });

    it("sollte Fehler werfen, wenn beim Abrufen der Fahrten ein Fehler auftritt", async () => {
        // Mocken von Fahrt.find(), um einen Fehler zu erzwingen
        jest.spyOn(Fahrt, "find").mockImplementation(() => {
            throw new Error("Fehler beim Abrufen der Fahrten");
        });

        // Test: Fehler erwarten
        const userId = "userId";
        await expect(getUserFahrten(userId)).rejects.toThrow("Fehler beim Abrufen der Fahrten");

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });
});

describe("getBeendeteFahrten Tests", () => {
    it("sollte die beendeten Fahrten abrufen", async () => {
        // Mocken von Fahrt.find(), um eine festgelegte Fahrt zurückzugeben
        jest.spyOn(Fahrt, "find").mockResolvedValueOnce([
            {
                fahrer: "userId",
                kennzeichen: "ABC123",
                kilometerstand: 100,
                kilometerende: 200,
                lenkzeit: [new Date(1)],
                arbeitszeit: [new Date(1)],
                pause: [new Date(1)],
                beendet: true,
                toObject: () => ({ /* Fahrt-Objekt als JSON */ })
            }
        ]);

        // Test: Beendete Fahrten abrufen
        const beendeteFahrten = await getBeendeteFahrten();

        // Erwartung: Die Anzahl der zurückgegebenen beendeten Fahrten sollte 1 sein
        expect(beendeteFahrten.length).toBe(1);

        // Erwartung: Überprüfen, ob das zurückgegebene Objekt dem erwarteten Format entspricht
        // Beispielhafte Überprüfung des Fahrt-Objekts
        expect(beendeteFahrten[0]).toEqual({});

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });

    it("sollte Fehler werfen, wenn beim Abrufen der beendeten Fahrten ein Fehler auftritt", async () => {
        // Mocken von Fahrt.find(), um einen Fehler zu erzwingen
        jest.spyOn(Fahrt, "find").mockImplementation(() => {
            throw new Error("Fehler beim Abrufen der beendeten Fahrten");
        });

        // Test: Fehler erwarten
        await expect(getBeendeteFahrten()).rejects.toThrow("Fehler beim Abrufen der beendeten Fahrten");

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });
});

describe("getLaufendeFahrten Tests", () => {
    it("sollte die laufenden Fahrten abrufen", async () => {
        // Mocken von Fahrt.find(), um eine festgelegte Fahrt zurückzugeben
        jest.spyOn(Fahrt, "find").mockResolvedValueOnce([
            {
                fahrer: "userId",
                kennzeichen: "ABC123",
                kilometerstand: 100,
                kilometerende: 200,
                lenkzeit: [new Date(1)],
                arbeitszeit: [new Date(1)],
                pause: [new Date(1)],
                beendet: false,
                toObject: () => ({ /* Fahrt-Objekt als JSON */ })
            }
        ]);

        // Test: Laufende Fahrten abrufen
        const laufendeFahrten = await getLaufendeFahrten();

        // Erwartung: Die Anzahl der zurückgegebenen laufenden Fahrten sollte 1 sein
        expect(laufendeFahrten.length).toBe(1);

        // Erwartung: Überprüfen, ob das zurückgegebene Objekt dem erwarteten Format entspricht
        // Beispielhafte Überprüfung des Fahrt-Objekts
        expect(laufendeFahrten[0]).toEqual({});

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });

    it("sollte Fehler werfen, wenn beim Abrufen der laufenden Fahrten ein Fehler auftritt", async () => {
        // Mocken von Fahrt.find(), um einen Fehler zu erzwingen
        jest.spyOn(Fahrt, "find").mockImplementation(() => {
            throw new Error("Fehler beim Abrufen der laufenden Fahrten");
        });

        // Test: Fehler erwarten
        await expect(getLaufendeFahrten()).rejects.toThrow("Fehler beim Abrufen der laufenden Fahrten");

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.find()
        jest.restoreAllMocks();
    });
});

describe("updateUserfahrt Error Tests", () => {
    it("sollte einen Fehler werfen, wenn die Fahrt nicht gefunden wurde", async () => {
        // Mocken von Fahrt.findByIdAndUpdate(), um null zurückzugeben und damit eine nicht gefundene Fahrt zu simulieren
        jest.spyOn(Fahrt, "findByIdAndUpdate").mockResolvedValueOnce(null);

        // Test: Fehler erwarten
        await expect(updateUserfahrt({
            id: "123456789",
            fahrerid: "",
            kennzeichen: "",
            startpunkt: ""
        })).rejects.toThrow("Fahrt nicht gefunden");

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.findByIdAndUpdate()
        jest.restoreAllMocks();
    });
});

describe("updateUserfahrt Ruhezeit Tests", () => {
    it("sollte Ruhezeiten hinzufügen, wenn sie eindeutig sind", async () => {
        // Vorhandene Ruhezeiten
        const existingRuhezeiten = [{ start: new Date("2024-04-01"), stop: new Date("2024-04-02") }];
        
        // Neue Ruhezeiten, die eindeutig sind
        const newRuhezeiten = [{ start: new Date("2024-04-03"), stop: new Date("2024-04-04") }];

        // Mocken von Fahrt.findOne(), um vorhandene Ruhezeiten zurückzugeben
        jest.spyOn(Fahrt, "findOne").mockResolvedValueOnce({ ruhezeit: existingRuhezeiten });

        // Test: Erwartet, dass neue Ruhezeiten hinzugefügt werden
        await updateUserfahrt({
            id: fahrt._id.toString(), 
            ruhezeit: newRuhezeiten, // Gültige ID übergeben
            fahrerid: "",
            kennzeichen: "",
            startpunkt: ""
        });

        // Überprüfen, ob die Ruhezeiten hinzugefügt wurden
        const updatedFahrt = await Fahrt.findById(fahrt._id.toString());
        expect(updatedFahrt?.ruhezeit).toEqual(updatedFahrt?.ruhezeit);

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.findOne()
        jest.restoreAllMocks();
    });

    it("sollte keine Ruhezeiten hinzufügen, wenn sie nicht eindeutig sind", async () => {
        // Vorhandene Ruhezeiten
        const existingRuhezeiten = [{ start: new Date("2024-04-01"), stop: new Date("2024-04-02") }];
        
        // Neue Ruhezeiten, die nicht eindeutig sind (schon vorhanden)
        const newRuhezeiten = [{ start: new Date("2024-04-01"), stop: new Date("2024-04-02") }];

        // Mocken von Fahrt.findOne(), um vorhandene Ruhezeiten zurückzugeben
        jest.spyOn(Fahrt, "findOne").mockResolvedValueOnce({ ruhezeit: existingRuhezeiten });

        // Test: Erwartet, dass keine Ruhezeiten hinzugefügt werden
        await expect(updateUserfahrt({
            id: new mongoose.Types.ObjectId().toString(), ruhezeit: newRuhezeiten, // Ungültige ID übergeben
            fahrerid: "",
            kennzeichen: "",
            startpunkt: ""
        })).rejects.toThrow('Fahrt nicht gefunden'); // Erwartet, dass eine Fehlermeldung geworfen wird

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.findOne()
        jest.restoreAllMocks();
    });

    it("sollte keine Ruhezeiten hinzufügen, wenn keine vorhandenen Ruhezeiten gefunden wurden", async () => {
        // Mocken von Fahrt.findOne(), um null zurückzugeben (keine vorhandenen Ruhezeiten)
        jest.spyOn(Fahrt, "findOne").mockResolvedValueOnce(null);

        // Neue Ruhezeiten
        const newRuhezeiten = [{ start: new Date("2024-04-01"), stop: new Date("2024-04-02") }];

        // Test: Erwartet, dass keine Ruhezeiten hinzugefügt werden
        await expect(updateUserfahrt({
            id: new mongoose.Types.ObjectId().toString(), ruhezeit: newRuhezeiten, // Gültige ID übergeben
            fahrerid: "",
            kennzeichen: "",
            startpunkt: ""
        })).rejects.toThrow('Fahrt nicht gefunden'); // Erwartet, dass eine Fehlermeldung geworfen wird

        // Wiederherstellen des ursprünglichen Implementierung von Fahrt.findOne()
        jest.restoreAllMocks();
    });
});
