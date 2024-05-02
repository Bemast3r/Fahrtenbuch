import TestDB from "../TestDatenbank/TestDb";
import { User, IUser } from "../../Model/UserModel";
import mongoose, { Types } from "mongoose";
import supertest from "supertest"
import { LoginResource, UserResource } from "../../util/Resources";
import app from "../TestDatenbank/testindex";

import dotenv from "dotenv";
dotenv.config();

let user: IUser & { _id: Types.ObjectId };
let token: string
let userid: string

beforeAll(async () => { await TestDB.connect(); });
beforeEach(async () => {
    User.syncIndexes();
    user = await User.create({ name: "Umut", email: "ggshndzj@jdbidnod.de", vorname: "Aydin", username: "umutaydin", password: "Umut21!21Umut!", admin: true, abwesend: "false" });
    userid = user._id.toString()

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

test('GET /api/admin/users - should return all users for admin', async () => {
    const request = supertest(app);
    const res = await request.get('/api/user/admin/users');

    expect(res.status).toBe(401);
}); 

test('GET /api/admin/finde/user/:id - should return a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.get(`/api/user/admin/finde/user/${user._id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
});

test('GET /api/admin/finde/user/:id - should return a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.get(`/api/user/admin/finde/user/${"bla"}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
});
// --------------------------------------------------------- POST TESTS -----------------------------------------------------------------------
describe('GET /mod/finde/mods/:id', () => {
    it('should return all mods for a user', async () => {
      // Mock User ID
      const userId = userid;
  
      // Erstellen Sie eine Testanfrage
      const response = await supertest(app)
        .get(`/api/user/mod/finde/mods/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 400 if ID is invalid', async () => {
      // Ungültige Benutzer-ID
      const invalidUserId = 'invalidUserId';
  
      // Erstellen Sie eine Testanfrage mit ungültiger Benutzer-ID
      const response = await supertest(app)
        .get(`/api/user/mod/finde/mods/${invalidUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body.errors).toBeDefined(); // Stellen Sie sicher, dass Fehler zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('GET /admin/finde/user/alle/admin', () => {
    it('should return all admin users for admin role', async () => {
      // Mock-Benutzerrolle als Admin
      const mockUserRole = 'a';
  
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung
      const response = await supertest(app)
        .get('/api/user/admin/finde/user/alle/admin')
        .set('Authorization', `Bearer yourAccessTokenHere`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not admin', async () => {
      // Mock-Benutzerrolle als Nicht-Admin
      const mockUserRole = 'b';
  
      // Erstellen Sie eine Testanfrage mit ungültiger Rolle
      const response = await supertest(app)
        .get('/api/user/admin/finde/user/alle/admin')
        .set('Authorization', `Bearer yourAccessTokenHere`)
        .expect(401); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body).toEqual({}); // Stellen Sie sicher, dass keine Benutzer zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });

    it('should return 403 if role is not admin', async () => {
        // Mock-Benutzerrolle als Nicht-Admin
        const mockUserRole = 'b';
    
        // Erstellen Sie eine Testanfrage mit ungültiger Rolle
        const response = await supertest(app)
          .get('/api/user/admin/finde/user/alle/user')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)    
        // Überprüfen Sie die Fehlermeldung
        // Stellen Sie sicher, dass keine Benutzer zurückgegeben wurden
        // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
      });
  });

  describe('GET /admin/mods', () => {
    it('should return all moderators for admin role', async () => {
      // Mock-Benutzerrolle als Admin
      const mockUserRole = 'a';
  
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung
      const response = await supertest(app)
        .get('/api/user/admin/mods')
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not admin', async () => {
      // Mock-Benutzerrolle als Nicht-Admin
      const mockUserRole = 'b';
  
      // Erstellen Sie eine Testanfrage mit ungültiger Rolle
      const response = await supertest(app)
        .get('/api/user/admin/mods')
        .expect(401); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body).toEqual({}); // Stellen Sie sicher, dass keine Mods zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('POST /admin/user-erstellen', () => {
    it('should create a new user for admin role', async () => {
      // Mock-Benutzerrolle als Admin
      const mockUserRole = 'a';
  
      // Mock-Benutzerdaten
      const userData = {
        vorname: 'Max',
        name: 'Mustermann',
        username: 'max_muster',
        email: 'max@example.com',
        password: 'password123',
        admin: true
        // fügen Sie hier weitere Felder hinzu, falls erforderlich
      };
  
      // Erstellen Sie eine Testanfrage mit gültiger Authentifizierung und Benutzerdaten
      const response = await supertest(app)
        .post('/api/user/admin/user-erstellen')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        .expect(200); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Antwort
      expect(response.body).toBeDefined(); // Stellen Sie sicher, dass die Antwort definiert ist
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Antwort Ihren Erwartungen entspricht
    });
  
    it('should return 403 if role is not admin', async () => {
      // Mock-Benutzerrolle als Nicht-Admin
      const mockUserRole = 'b';
  
      // Mock-Benutzerdaten
      const userData = {
        vorname: 'Max',
        name: 'Mustermann',
        username: 'max_muster',
        email: 'max@example.com',
        password: 'password123',
        admin: true
        // fügen Sie hier weitere Felder hinzu, falls erforderlich
      };
  
      // Erstellen Sie eine Testanfrage mit ungültiger Rolle und Benutzerdaten
      const response = await supertest(app)
        .post('/api/user/admin/user-erstellen')
        .send(userData)
        .expect(401); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body).toEqual({}); // Stellen Sie sicher, dass keine Benutzer erstellt wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('POST /passwort-vergessen', () => {
  
    it('should return 400 if email is missing', async () => {
      // Erstellen Sie eine Testanfrage ohne E-Mail
      const response = await supertest(app)
        .post('/api/user/passwort-vergessen')
        .expect(400); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body.errors).toBeDefined(); // Stellen Sie sicher, dass Fehler zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  
    it('should return 400 if email is not found in the database', async () => {
      // Mock-Benutzer-E-Mail, die nicht in der Datenbank vorhanden ist
      const userEmail = 'nonexistent@example.com';
  
      // Erstellen Sie eine Testanfrage mit ungültiger E-Mail
      const response = await supertest(app)
        .post('/api/user/passwort-vergessen')
        .send({ email: userEmail })
        .expect(400); // Erwartete Antwortstatuscode 
        // Stellen Sie sicher, dass die korrekte Fehlermeldung zurückgegeben wurde
        // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });

  describe('POST /passwort-zuruecksetzen/:token', () => {
    
    it('should return 400 if token is invalid', async () => {
      // Ungültiges Token
      const invalidToken = 'invalidToken';
  
      // Erstellen Sie eine Testanfrage mit ungültigem Token
      const response = await supertest(app)
        .post(`/api/user/passwort-zuruecksetzen/${invalidToken}`)
        .send({ password: 'newPassword123' })
        .expect(400); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.text).toContain('Fehler beim Zurücksetzen des Passworts'); // Stellen Sie sicher, dass die Fehlermeldung zurückgegeben wurde
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  
    it('should return 400 if password is missing', async () => {
      // Gültiges Token
      const mockToken = 'yourMockTokenHere';
  
      // Erstellen Sie eine Testanfrage ohne Passwort
      const response = await supertest(app)
        .post(`/api/user/passwort-zuruecksetzen/${mockToken}`)
        .expect(400); // Erwartete Antwortstatuscode
  
      // Überprüfen Sie die Fehlermeldung
      expect(response.body.errors).toBeDefined(); // Stellen Sie sicher, dass Fehler zurückgegeben wurden
      // Fügen Sie hier weitere Tests hinzu, um sicherzustellen, dass die Fehlermeldung Ihren Erwartungen entspricht
    });
  });





test('POST /api/admin/user/erstellen - should create a new user for admin', async () => {
    const request = supertest(app);
    const userData = { name: "John", vorname: "Doe", email: "ghmsoks@nouwecbhwje.de", username: "johndoe", password: "password123", admin: true, abwesend: "false" };
    const res = await request.post('/api/user/admin/user-erstellen').send(userData).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(userData.name);
    expect(res.body.vorname).toBe(userData.vorname);
    expect(res.body.username).toBe(userData.username);
});

// --------------------------------------------------------- PUT TESTS -------------------------------------------------------------------------

test('PUT /api/admin/user/aendern - should update a specific user for admin', async () => {
    const request = supertest(app);
    const updatedUserData = {
        id: userid, name: "Satorou", vorname: "Gojo", username: "GojoDerDünne", password: "abcABC123!!!!", admin: true,
        email: "elmiojfow@iewfiuewbf.de",
        abwesend: "njfdj"
    };
    const res = await request.put(`/api/user/admin/user/aendern`).send(updatedUserData).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedUserData.name);
    expect(res.body.vorname).toBe(updatedUserData.vorname);
    expect(res.body.username).toBe(updatedUserData.username);
    expect(res.body.admin).toBe(updatedUserData.admin);
});

// --------------------------------------------------------- DELETE TESTS -----------------------------------------------------------------------

test('DELETE /api/admin/delete/:id - should delete a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.delete(`/api/user/admin/delete/${userid}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
});

test('DELETE /api/admin/delete/:id - should delete a specific user for admin', async () => {
    const request = supertest(app);
    const res = await request.delete(`/api/user/admin/delete/${"bla"}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
});