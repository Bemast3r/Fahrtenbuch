import { IUser, User } from "../../Model/UserModel";
import dotenv from "dotenv";
import { Types } from "mongoose";
import supertest from "supertest";
import { LoginResource } from "util/Resources";
import app from "../TestDatenbank/testindex";
import { Fahrt, IFahrt } from "../../Model/FahrtModel";
import TestDB from "../TestDatenbank/TestDb";
dotenv.config();

let user: IUser & { _id: Types.ObjectId };
let user2: IUser & { _id: Types.ObjectId };

let fahrt: IFahrt & { _id: Types.ObjectId };

let token: string
let token2: string

let userid: string
let userid2: string

let fahrtid: string

beforeAll(async () => { await TestDB.connect(); });
beforeEach(async () => {
    User.syncIndexes();
    user = await User.create({ name: "Umut", email: "ggshndzj@jdbidnod.de", vorname: "Aydin", username: "umutaydin", password: "Umut21!21Umut!", admin: true, abwesend: "false" });

    user2 = await User.create({ name: "Umu22t", email: "ggshn22dzj@jdbidnod.de", vorname: "Ay22din", username: "umutay22din", password: "Umut21!21Umut!", mod: true, abwesend: "false" });
    fahrt = await Fahrt.create({
        fahrer: user._id,
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

    userid = user._id.toString()
    userid2 = user2._id.toString()

    fahrtid = fahrt._id.toString()


    // Login um Token zu erhalten
    const request = supertest(app);
    const loginData = { username: "umutaydin", password: "Umut21!21Umut!" };
    const response = await request.post(`/api/login`).send(loginData);
    const loginResource = response.body as LoginResource;
    token = loginResource.access_token;

    const loginData2 = { username: "umutay22din", password: "Umut21!21Umut!" };
    const response2 = await request.post(`/api/login`).send(loginData2);
    const loginResource2 = response2.body as LoginResource;
    token2 = loginResource2.access_token;
    expect(token).toBeDefined();
});
afterEach(async () => { await TestDB.clear(); });
afterAll(async () => { await TestDB.close(); });

describe('GET /admin/alle/fahrten', () => {
    it('should return all trips for admin role', async () => {
      // Mock-Benutzerrolle als Admin
      const mockUserRole = 'a';
  
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung
      const response = await supertest(app)
        .get('/api/fahrt/admin/alle/fahrten')
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not admin', async () => {
      // Mock-Benutzerrolle als Nicht-Admin
      const mockUserRole = 'b';
  
      // Erstellen Sie eine Testanfrage mit ungültiger Rolle
      const response = await supertest(app)
        .get('/api/fahrt/admin/alle/fahrten')
        .expect(401); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });
  describe('GET /admin/fahrt/user/:id', () => {
    it('should return trips for a specific user', async () => {
      // Mock-Benutzer-ID
      const userId = userid;
  
      // Erstellen Sie eine Testanfrage mit gültiger Benutzer-ID
      const response = await supertest(app)
        .get(`/api/fahrt/admin/fahrt/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 400 if user ID is invalid', async () => {
      // Ungültige Benutzer-ID
      const invalidUserId = "test";
  
      // Erstellen Sie eine Testanfrage mit ungültiger Benutzer-ID
      const response = await supertest(app)
        .get(`/api/fahrt/admin/fahrt/user/${invalidUserId}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(400); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('GET /mod/alle/fahrten', () => {
    it('should return trips for mod users', async () => {
      // Mock-Benutzer-ID  
      // Erstellen Sie eine Testanfrage mit gültiger Benutzer-ID und Rolle als Mod
      await supertest(app)
        .get('/api/fahrt/mod/alle/fahrten')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not mod', async () => {
      // Mock-Benutzer-ID
      const userId = 'yourUserIdHere';
  
      // Erstellen Sie eine Testanfrage mit gültiger Benutzer-ID und ungültiger Rolle
      const response = await supertest(app)
        .get('/api/fahrt/mod/alle/fahrten')
        .set('Authorization', `Bearer ${token}`)
        .set('role', 'a')
        .set('userId', userId)
        .expect(403); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body).toEqual({}); // Stellen Sie sicher, dass keine Fahrten zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('GET /admin/laufende/fahrten', () => {
    it('should return ongoing trips for admin', async () => {
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung und Rolle als Admin
      const response = await supertest(app)
        .get('/api/fahrt/admin/laufende/fahrten')
        .set('Authorization', `Bearer ${token}`)
        .set('role', 'a')
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not admin', async () => {
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung und ungültiger Rolle
      const response = await supertest(app)
        .get('/api/fahrt/admin/laufende/fahrten')
        .set('Authorization', `Bearer ${token2}`)
        .expect(403); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body).toEqual({}); // Stellen Sie sicher, dass keine Fahrten zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('GET /admin/beendete/fahrten', () => {
    it('should return completed trips for admin', async () => {
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung und Rolle als Admin
      const response = await supertest(app)
        .get('/api/fahrt/admin/beendete/fahrten')
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not admin', async () => {
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung und ungültiger Rolle
      const response = await supertest(app)
        .get('/api/fahrt/admin/beendete/fahrten')
        .set('Authorization', `Bearer ${token2}`)
        .set('role', 'm')
        .expect(403); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body).toEqual({}); // Stellen Sie sicher, dass keine Fahrten zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });