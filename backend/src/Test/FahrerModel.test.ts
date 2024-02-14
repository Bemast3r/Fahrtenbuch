import { Fahrer, IFahrer } from "../db/FahrtModel"
import { Types } from "mongoose";
import TestDB from "./TestDb";

let userUmut: IUser & { _id: Types.ObjectId; }

beforeAll(async () => await TestDB.connect())
beforeEach(async () => {
  userUmut = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [], abwesend: false });
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

test("Passwort verschlüsseln", async () => {
  const newUser = await User.create({ name: "Test", nachname: "User", username: "testuser", password: "test123", fahrzeuge: [], abwesend: false });
  const hashedPassword = await newUser.password;
  expect(hashedPassword).not.toBe("test123");
  expect(hashedPassword).toHaveLength(60);
});

test("Benutzer aktualisieren", async () => {
  const updatedUser = await User.findByIdAndUpdate(userUmut._id, { name: "UpdatedName" }, { new: true });

  expect(updatedUser).toBeDefined();
  expect(updatedUser.name).toBe("UpdatedName");
});

test("Benutzer löschen", async () => {
  await User.findByIdAndDelete(userUmut._id);
  const deletedUser = await User.findById(userUmut._id);
  expect(deletedUser).toBeNull();
});

test("Benutzer nach Benutzernamen suchen", async () => {
  const foundUser = await User.findOne({ username: "umutaydin" });
  expect(foundUser).toBeDefined();
  expect(foundUser?.name).toBe("Umut");
});

test("Fahrzeuge", async () => {
  const newUser = await User.create({
    name: "Test", nachname: "User", username: "testuser", password: "test123", fahrzeuge: [
      { datum: new Date(), kennzeichen: "ABC123" },
      { datum: new Date(), kennzeichen: "XYZ789" }
    ], abwesend: false
  });

  expect(newUser.fahrzeuge.length).toBe(2)
  try {
    expect(newUser.fahrzeuge).toEqual([
      { datum: new Date(), kennzeichen: "ABC123" },
      { datum: new Date(), kennzeichen: "XYZ789" }
    ])
  } catch (error) {
    console.log(error)
  }
});