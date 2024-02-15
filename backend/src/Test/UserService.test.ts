import { getUsers } from "Services/UserService";
import { IUser, User } from "db/UserModel";
import TestDB from "./TestDb";
import { Types } from "mongoose";

let person: IUser & { _id: Types.ObjectId; }
let another: IUser & { _id: Types.ObjectId; }
beforeAll(async () => await TestDB.connect())
beforeEach(async () => {
    person = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [{ datum: new Date(), kennzeichen: "XYZ789" }], abwesend: false });
    another = await User.create({
        name: "Can", nachname: "Pala", username: "canpala", password: "canna",
        fahrzeuge: [
            { datum: new Date(), kennzeichen: "ABC123" },
        ],
        abwesend: false
    });
})
afterEach(async () => await TestDB.clear())
afterAll(async () => await TestDB.close())


test("GET USER ", async () => {
    const found = await getUsers();

    expect(found).toBeDefined()
    expect(found).toEqual([person, another])
})
