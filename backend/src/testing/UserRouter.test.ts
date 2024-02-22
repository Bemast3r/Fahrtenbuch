import TestDB from "../Services/TestDb";
import { User, IUser } from "../db/UserModel";
import mongoose, { Types } from "mongoose";
import { Fahrt, IFahrt } from "../db/FahrtModel";
import supertest from "supertest"
import { LoginResource } from "../db/Resources";
import  app  from "../testing/testindex";

import dotenv from "dotenv";
dotenv.config();

let user: IUser & { _id: Types.ObjectId };
let fahrt: IFahrt & { _id: Types.ObjectId };
let token: string

beforeAll(async () => { await TestDB.connect(); });
beforeEach(async () => {
    User.syncIndexes();
    user = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [], abwesend: false });
    // fahrt = await Fahrt.create({
    //     fahrer: user._id,
    //     kennzeichen: "ABC123",
    //     kilometerstand: 100,
    //     kilometerende: 200,
    //     lenkzeit: 8,
    //     arbeitszeit: 10,
    //     pause: 2
    // });

    // Login um Token zu erhalten
    const request = supertest(app);
    const loginData = { username: "SKM", password: "abcABC123!"};
    const response = await request.post(`/api/login`).send(loginData);
    console.log(response.body)
    const loginResource = response.body as LoginResource;
    token = loginResource.access_token;
    expect(token).toBeDefined();
});
afterEach(async () => { await TestDB.clear(); });
afterAll(async () => { await TestDB.close(); });

// --------------------------------------------------------- GET TESTS -----------------------------------------------------------------------


test('GET /api/admin/users - should return all users for admin', async () => {
    const request = supertest(app);
    const res = await request.get('/api/admin/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // expect(res.body).toEqual(expect.arrayContaining([]));
});

test('GET /api/admin/finde/user/:id - should return a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.get(`/api/admin/finde/user/${user._id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
});

// --------------------------------------------------------- POST TESTS -----------------------------------------------------------------------

// --------------------------------------------------------- PUT TESTS -----------------------------------------------------------------------

// --------------------------------------------------------- DELETE TESTS -----------------------------------------------------------------------