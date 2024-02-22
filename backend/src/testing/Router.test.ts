// import { User, IUser } from "../db/UserModel";
// import mongoose, { Types } from "mongoose";
// import TestDB from "../Services/TestDb";
// import { Fahrt, IFahrt } from "../db/FahrtModel";
// import supertest from 'supertest'


// let Fahrer: IUser & { _id: Types.ObjectId };
// let fahrt: IFahrt & { _id: Types.ObjectId };

// beforeAll(async () => {
//     await TestDB.connect();
// });

// beforeEach(async () => {
//     Fahrer = await User.create({ name: "Umut", nachname: "Aydin", username: "umutaydin", password: "umut21", fahrzeuge: [], abwesend: false });
//     fahrt = await Fahrt.create({
//         fahrer: Fahrer._id,
//         kennzeichen: "ABC123",
//         kilometerstand: 100,
//         kilometerende: 200,
//         lenkzeit: 8,
//         arbeitszeit: 10,
//         pause: 2
//     });
// });

// afterEach(async () => {
//     await TestDB.clear();
// });

// afterAll(async () => {
//     await TestDB.close();
// });

// describe("POST /user ", () =>{

//     describe("given a username and password", ()=>{

//         const response = request(app).post("/users").send({
//             username: "username",
//             password: "ABCabc123!"
//         })
//     })
// })

