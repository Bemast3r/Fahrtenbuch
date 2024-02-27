import TestDB from "../Services/TestDb";
import { User, IUser } from "../db/UserModel";
import mongoose, { Types } from "mongoose";
import supertest from "supertest"
import { LoginResource } from "../db/Resources";
import app from "../testing/testindex";

import dotenv from "dotenv";
dotenv.config();

let user: IUser & { _id: Types.ObjectId };
let token: string
let userid: string

beforeAll(async () => { await TestDB.connect(); });
beforeEach(async () => {
    User.syncIndexes();
    user = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "Umut21!21Umut!", admin: true, fahrzeuge: [], abwesend: "false" });
    //userid = user._id.toString()

    // Login um Token zu erhalten
    const request = supertest(app);
    const loginData = { username: "umutaydin", password: "Umut21!21Umut!" };
    const response = await request.post(`/api/login`).send(loginData);
    const loginResource = response.body as LoginResource;
    token = loginResource.access_token;
    expect(token).toBeDefined();
});
afterEach(async () => { await TestDB.clear(); });
afterAll(async () => { await TestDB.close(); });

// --------------------------------------------------------- GET TESTS -----------------------------------------------------------------------

test('GET /api/admin/users - should return all users for admin', async () => {
    const request = supertest(app);
    const res = await request.get('/api/user/admin/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
}); 

test('GET /api/admin/finde/user/:id - should return a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.get(`/api/user/admin/finde/user/${userid}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
});

// --------------------------------------------------------- POST TESTS -----------------------------------------------------------------------

test('POST /api/admin/user/erstellen - should create a new user for admin', async () => {
    const request = supertest(app);
    const userData = { name: "John", nachname: "Doe", username: "johndoe", password: "password123", admin: true, fahrzeuge: [""], abwesend: "false" };
    const res = await request.post('/api/user/admin/user/erstellen').send(userData).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(userData.name);
    expect(res.body.nachname).toBe(userData.nachname);
    expect(res.body.username).toBe(userData.username);
});

// --------------------------------------------------------- PUT TESTS -------------------------------------------------------------------------

test('PUT /api/admin/user/aendern - should update a specific user for admin', async () => {
    const request = supertest(app);
    const updatedUserData = { id: userid, name: "Satorou", nachname: "Gojo", username: "GojoDerDünne", password: "abcABC123!!!!", fahrzeuge: [{ datum: Date.now(), kennzeichen: "Merces Benzer AMG" }], abwesend: "true", admin: true };
    const res = await request.put(`/api/user/admin/user/aendern`).send(updatedUserData).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedUserData.name);
    expect(res.body.nachname).toBe(updatedUserData.nachname);
    expect(res.body.username).toBe(updatedUserData.username);
    expect(res.body.fahrzeuge).not.toEqual(updatedUserData.fahrzeuge);
    expect(res.body.abwesend).toBe(updatedUserData.abwesend);
    expect(res.body.admin).toBe(updatedUserData.admin);
});

// --------------------------------------------------------- DELETE TESTS -----------------------------------------------------------------------

test('DELETE /api/admin/delete/:id - should delete a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.delete(`/api/user/admin/delete/${user._id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
});