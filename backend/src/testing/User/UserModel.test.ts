import { User, IUser } from "../../Model/UserModel";
import { Types } from "mongoose";
import TestDB from "../TestDatenbank/TestDb";

let userUmut: IUser & { _id: Types.ObjectId; }

beforeAll(async () => await TestDB.connect());
beforeEach(async () => {
    userUmut = await User.create({ name: "Umut", email: "zfdwzdhgz@gmail.com", vorname: "Aydin", username: "umutaydin", password: "umut21", abwesend: "false" });
});
afterEach(async () => await TestDB.clear());
afterAll(async () => await TestDB.close());

test("Benutzer erstellen und speichern", async () => {
    const newUser = await User.create({ name: "Max", email: "zfdwzffdz@gmail.com", vorname: "Mustermann", username: "maxm", password: "max123", abwesend: "false" });
    const createdUser = await newUser.save();

    expect(createdUser._id).toBeDefined();
    expect(createdUser.vorname).toBe("Mustermann");
    expect(createdUser.name).toBe("Max");
    expect(createdUser.username).toBe("maxm");
    expect(createdUser.password).toBeDefined();
    expect(createdUser.admin).toBeFalsy();
    expect(createdUser.createdAt).toBeDefined();
    expect(createdUser.abwesend).toBe("false");
});

test("Benutzer erstellen und speichern", async () => {
  const newUser = await User.create({
      vorname: "Max",
      name: "Mustermann",
      username: "maxm",
      email: "max@example.com", 
      password: "max123",
      abwesend: "false"
  });
  const createdUser = await newUser.save();

  expect(createdUser._id).toBeDefined();
  expect(createdUser.vorname).toBe("Max");
  expect(createdUser.name).toBe("Mustermann");
  expect(createdUser.username).toBe("maxm");
  expect(createdUser.password).toBeDefined();
  expect(createdUser.admin).toBeFalsy();
  expect(createdUser.createdAt).toBeDefined();
  expect(createdUser.abwesend).toBe("false");
});

test("Passwortverschlüsselung", async () => {
  const newUser = await User.create({
      vorname: "Test",
      name: "User",
      username: "testuser",
      email: "test@example.com",
      password: "test123",
      modUser: [],
      abwesend: "false"
  });
  const createdUser = await User.findById(newUser._id);

  expect(createdUser).toBeDefined();
  expect(createdUser?.password).not.toBe("test123");
  expect(createdUser?.password).toHaveLength(60);
});

test("isPasswordCorrect test", async () => {
  const newUser = await User.create({
      name: "Test", vorname: "User", username: "testuser", email:"umizjjo@gmail.com", password: "test123", abwesend: "false"
  });
  
  await expect(newUser.isPasswordCorrect("test123")).resolves.toBeTruthy();
});

test("isPasswordCorrect wirft einen Fehler bei modifiziertem Benutzer", async () => {
  const newUser = await User.create({
      name: "Test", vorname: "User", username: "testuser", password: "test123", email:"umizo@gmail.com", abwesend: "false"
  });
  
  // Modify the user
  newUser.password = "123123132";

  // Ensure that isPasswordCorrect throws an error
  await expect(newUser.isPasswordCorrect("test123")).rejects.toThrowError("User has been modified");
});


