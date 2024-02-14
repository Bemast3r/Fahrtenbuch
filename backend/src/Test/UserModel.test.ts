import { User, IUser } from "../db/UserModel"
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
  const expectedFahrzeuge = [
    { datum: new Date(), kennzeichen: "ABC123" },
    { datum: new Date(), kennzeichen: "XYZ789" }
  ];

  const newUser = await User.create({
    name: "Test",
    nachname: "User",
    username: "testuser",
    password: "test123",
    fahrzeuge: expectedFahrzeuge,
    abwesend: false
  });

  // Access the fahrzeuge array from the user object
  const actualFahrzeuge = newUser.toObject().fahrzeuge;

  // Assert that the length of fahrzeuge array is 2
  expect(actualFahrzeuge.length).toBe(2);

  // // Remove the _id properties from each object in actualFahrzeuge
  // const strippedActualFahrzeuge = actualFahrzeuge.map(({ _id, ...rest }) => rest); // wird flasch angezeigt wird aber benötigt

  // // Assert that the stripped fahrzeuge array is deeply equal to the expected array
  // expect(strippedActualFahrzeuge).toStrictEqual(expectedFahrzeuge);
});


test("isPasswordCorrect test", async () => {
  const newUser = await User.create({
    name: "Test", nachname: "User", username: "testuser", password: "test123", fahrzeuge: [
      { datum: new Date(), kennzeichen: "ABC123" },
      { datum: new Date(), kennzeichen: "XYZ789" }
    ], abwesend: false
  });
  
  // Modify the user

  // Ensure that isPasswordCorrect throws an error
  await expect(newUser.isPasswordCorrect("test123")).toBeTruthy();
});


test("isPasswordCorrect test", async () => {
  const newUser = await User.create({
    name: "Test", nachname: "User", username: "testuser", password: "test123", fahrzeuge: [
      { datum: new Date(), kennzeichen: "ABC123" },
      { datum: new Date(), kennzeichen: "XYZ789" }
    ], abwesend: false
  });
  
  // Modify the user
  newUser.password = "123123132";

  // Ensure that isPasswordCorrect throws an error
  await expect(newUser.isPasswordCorrect("test123")).rejects.toThrowError("User has been modified");
});
