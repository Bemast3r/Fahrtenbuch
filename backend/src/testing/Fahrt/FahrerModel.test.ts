import { Fahrt, IFahrt } from "../../Model/FahrtModel"
import { Types } from "mongoose";
import TestDB from "../TestDatenbank/TestDb";
import { IUser, User } from "../../Model/UserModel";

let userUmut: IUser & { _id: Types.ObjectId; }
let fahrermo: IFahrt & { _id: Types.ObjectId }
beforeAll(async () => await TestDB.connect())
beforeEach(async () => {
  userUmut = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [{ datum: new Date(), kennzeichen: "ABC123" }], abwesend: false });
  fahrermo = await Fahrt.create({ fahrer: userUmut._id, kennzeichen: userUmut.fahrzeuge[userUmut.fahrzeuge.length - 1].kennzeichen, kilometerstand: 200, kilometerende: 210, lenkzeit: 5, pause: 2, arbeitszeit: 3 })
})
afterEach(async () => await TestDB.clear())
afterAll(async () => await TestDB.close())

test("Benutzer erstellen und speichern", async () => {
  const newUser = await User.create({ name: "Max", nachname: "Mustermann", username: "maxm", password: "max123", fahrzeuge: [], abwesend: false });
  const createdUser = await newUser.save();

  expect(createdUser._id).toBeDefined();
  expect(createdUser.name).toBe("Max");
  expect(createdUser.nachname).toBe("Mustermann");
  expect(createdUser.username).toBe("maxm");
  expect(createdUser.password).toBeDefined();
  expect(createdUser.admin).toBeFalsy();
  expect(createdUser.createdAt).toBeDefined();
  expect(createdUser.fahrzeuge).toEqual([]);
  expect(createdUser.abwesend).toBeFalsy();
});

test("Fahrt erstellt", async () => {

  expect(fahrermo._id).toBeDefined()
  expect(fahrermo.lenkzeit).toBe(5)
  expect(fahrermo.kilometerende).toBe(210)
  expect(fahrermo.createdAt).toBeDefined()
  expect(fahrermo.kennzeichen).toEqual("ABC123")
  expect(fahrermo.kilometerstand).toBe(200)
  expect(fahrermo.pause).toBe(2)
  expect(fahrermo.arbeitszeit).toBe(3)
})