import { getJWT } from "../Components/Logincontext";
import { FahrtResource, LoginResource, UserResource } from "../util/Resources";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const jwt = getJWT()

export async function login(loginData: { username: string, password: string }): Promise<LoginResource> {
    if (!loginData.username)
        throw new Error("email not defined");
    if (!loginData.password)
        throw new Error("password not defined");

    const response = await fetch(`http://localhost:5000/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!response)
        throw new Error("Beim Verbinden mit dem Server ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
    if (response.status === 400 || response.status === 401)
        throw new Error("Ihre Anmeldeinformationen sind falsch. Bitte versuchen Sie es erneut.");
    if (response.status === 405)
        throw new Error("Der Server hat einen unbekannten Fehler festgestellt. Bitte versuchen Sie es später erneut.");
    if (response.status !== 201) {
        throw new Error("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    }
    if (!response.ok) {
        throw new Error("Versuche es erneut.")
    }
    const result: LoginResource = await response.json();
    if (!result.access_token || !result.token_type)
        throw String("Der Server hat eine ungültige Antwort zurückgegeben. Bitte versuche es später erneut.");
    return result;
}

export async function getUsers(userID: string): Promise<UserResource> {
    try {
        if (!userID)
            throw new Error("userID not defined");

        const jwt = getJWT();
        if (!jwt)
            throw new Error("no jwt found");

        const response = await fetch(`${BASE_URL}/api/admin/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });

        if (!response || !response.ok)
            throw new Error("network response was not OK");

        const result: any = await response.json();
        if (!result)
            throw new Error("invalid result from server");
        if (!result.id || !result.email || !result.name)
            throw new Error("result from server is missing fields");
        return result as UserResource;

    } catch (error) {
        throw new Error("Error occurred during get: " + error);
    }
}

export async function getUser(userID: string): Promise<UserResource> {
    try {
        if (!userID) {
            throw new Error("userID not defined");
        }
        const jwt2 = getJWT();
        if (!jwt2)
            throw new Error("no jwt found");
        const response = await fetch(`http://localhost:5000/api/user/admin/finde/user/${userID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response || !response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.")
        }
        const result: UserResource = await response.json();
        if (!result) {
            throw new Error("Result ist nicht ok.")
        }
        return result
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`)
    }
}

export async function postFahrt(fahrt: FahrtResource): Promise<FahrtResource> {
    try {
        const jwt2 = getJWT();
        const response = await fetch(`http://localhost:5000/api/fahrt/user/fahrt/erstellen`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fahrerid: fahrt.fahrerid, kennzeichen: fahrt.kennzeichen, kilometerstand: fahrt.kilometerstand, startpunkt: fahrt.startpunkt })
        });
        if (!response || !response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.")
        }
        const result: FahrtResource = await response.json();
        if (!result) {
            throw new Error("Result ist nicht ok.")
        }
        return result
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`)
    }
}


export async function getFahrt(userID: string): Promise<FahrtResource[]> {
    try {
        const jwt2 = getJWT();
        if (!jwt2)
            throw new Error("no jwt found");
        const response = await fetch(`http://localhost:5000/api/fahrt/admin/fahrt/user/${userID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response || !response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.")
        }
        const result: FahrtResource[] = await response.json();
        if (!result) {
            throw new Error("Result ist nicht ok.")
        }
        return result
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`)
    }
}



export async function updateFahrt(fahrt: FahrtResource): Promise<FahrtResource> {
    try {

        const jwt2 = getJWT();
        const response = await fetch(`http://localhost:5000/api/fahrt/user/fahrt/bearbeiten/${fahrt._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${jwt2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fahrt)
        });
        if (!response || !response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.")
        }
        const result = await response.json();
        if (!result) {
            throw new Error("Result ist nicht ok.")
        }
        return result
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`)
    }
}

export async function passwortVergessen(email: string) {
    try {
        const response = await fetch(`http://localhost:5000/api/user/passwort-vergessen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }) // Hier email direkt in einem Objekt
        });
        if (!response || !response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.")
        }
        const result = response;
        if (!result) {
            throw new Error("Result ist nicht ok.")
        }
        return result
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`)
    }
}

export async function passwortZuruecksetzen(token: string, password: string) {
    try {
        // const decodedToken = decodeURIComponent(token); 
        const response = await fetch(`http://localhost:5000/api/user/passwort-zuruecksetzen/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });
        if (!response || !response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.");
        }
        const result = response;
        if (!result) {
            throw new Error("Result ist nicht ok.");
        }
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}

export async function createUserWithAdmin(user: UserResource): Promise<UserResource> {
    try {
        if (!user) {
            throw new Error("user not defined");
        }
        const jwt2 = getJWT();
        if (!jwt2) {
            throw new Error("no jwt found");
        }
        const response = await fetch("http://localhost:5000/api/user/admin/user-erstellen", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user) // Send user data in request body
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        const result: UserResource = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}
