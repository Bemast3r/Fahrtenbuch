
import { getJWT } from "../Components/Context/Logincontext";
import { FahrtResource, LoginResource, UserResource } from "../util/Resources";

// const BASE_URL = "https://fahrtenbuch-backend.vercel.app/";
const BASE_URL = "http://localhost:5000/";


export async function login(loginData: { username: string, password: string }): Promise<LoginResource> {
    if (!loginData.username)
        throw new Error("email not defined");
    if (!loginData.password)
        throw new Error("password not defined");

    const response = await fetch(`${BASE_URL}api/login/`, {
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

export async function getUsers(): Promise<UserResource[]> {
    try {
        const jwt = getJWT();
        if (!jwt)
            throw new Error("no jwt found");

        const response = await fetch(`${BASE_URL}api/user/admin/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        });
        if (!response || !response.ok)
            throw new Error("network response was not OK");

        const result: any = await response.json();
        if (!result)
            throw new Error("invalid result from server");
        return result;

    } catch (error) {
        throw new Error("Error occurred during get: " + error);
    }
}

export async function getMods(): Promise<UserResource[]> {
    try {
        const jwt = getJWT();
        if (!jwt)
            throw new Error("no jwt found");

        const response = await fetch(`${BASE_URL}api/user/admin/mods`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        });
        if (!response || !response.ok)
            throw new Error("network response was not OK");

        const result: any = await response.json();
        if (!result)
            throw new Error("invalid result from server");
        return result;

    } catch (error) {
        throw new Error("Error occurred during get: " + error);
    }
}





export async function deleteUser(id: string): Promise<void> {
    try {
        const jwt = getJWT();
        if (!jwt)
            throw new Error("no jwt found");

        const response = await fetch(`${BASE_URL}api/user/admin/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        });
        if (!response || !response.ok)
            throw new Error("network response was not OK");

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
        const response = await fetch(`${BASE_URL}api/user/admin/finde/user/${userID}`, {
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
        const response = await fetch(`${BASE_URL}api/fahrt/user/fahrt/erstellen`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...fahrt })
        })
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
        const response = await fetch(`${BASE_URL}api/fahrt/admin/fahrt/user/${userID}`, {
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

export async function getModFahrten(): Promise<FahrtResource[]> {
    try {
        const jwt2 = getJWT();
        if (!jwt2)
            throw new Error("no jwt found");
        const response = await fetch(`${BASE_URL}api/fahrt/mod/alle/fahrten `, {
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
        const response = await fetch(`${BASE_URL}api/fahrt/user/fahrt/bearbeiten/${fahrt._id}`, {
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

export async function updateUser(user: UserResource): Promise<UserResource> {
    try {

        const jwt2 = getJWT();
        const response = await fetch(`${BASE_URL}api/user/admin/user/aendern`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${jwt2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
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
        const response = await fetch(`${BASE_URL}api/user/passwort-vergessen`, {
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
        const response = await fetch(`${BASE_URL}api/user/passwort-zuruecksetzen/${token}`, {
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
        const response = await fetch(`${BASE_URL}api/user/admin/user-erstellen`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user) // Send user data in request body
        });
        if (!response.ok) {
            const errorMessage = await response.text(); // Parse error message from server response
            throw new Error(`Server error: ${response.statusText} - ${errorMessage}`);
        }
        const result: UserResource = await response.json();
        return result;
    } catch (error: any) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}


export async function getCompletedTrips(): Promise<FahrtResource[]> {
    try {
        const jwt2 = getJWT();
        const response = await fetch(`${BASE_URL}api/fahrt/admin/beendete/fahrten`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.");
        }
        const result: FahrtResource[] = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}

export async function getOngoingTrips(): Promise<FahrtResource[]> {
    try {
        const jwt2 = getJWT();
        const response = await fetch(`${BASE_URL}api/fahrt/admin/laufende/fahrten`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.");
        }
        const result: FahrtResource[] = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}

export async function getAlleAdmin(): Promise<UserResource[]> {
    try {
        const jwt2 = getJWT();
        const response = await fetch(`${BASE_URL}api/user/admin/finde/user/alle/admin`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.");
        }
        const result: UserResource[] = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}

export async function getAlleModUser(userid: string): Promise<UserResource[]> {
    try {
        const jwt2 = getJWT();
        const response = await fetch(`${BASE_URL}api/user/mod/finde/mods/${userid}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.");
        }
        const result: UserResource[] = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}

export async function getAlleUser(): Promise<UserResource[]> {
    try {
        const jwt2 = getJWT();
        const response = await fetch(`${BASE_URL}api/user/admin/finde/user/alle/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt2}`
            }
        });
        if (!response.ok) {
            throw new Error("Netzwerkfehler, versuche es erneut.");
        }
        const result: UserResource[] = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Es gab einen Fehler: ${error}`);
    }
}

export async function getAllFahrts(): Promise<FahrtResource[]> {
    try {
        const jwt2 = getJWT();
        if (!jwt2)
            throw new Error("no jwt found");
        const response = await fetch(`${BASE_URL}api/fahrt/admin/alle/fahrten/`, {
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

export async function deleteFahrt(fahrt: FahrtResource): Promise<void> {
    try {
        if (!fahrt)
            throw new Error("Fahrt nicht definiert");

        const jwt = getJWT();
        if (!jwt)
            throw new Error("Kein JWT gefunden");

        const response = await fetch(`${BASE_URL}api/fahrt/admin/loesch/fahrt/${fahrt._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });

        if (!response.ok)
            throw new Error("Netzwerkantwort war nicht OK");

        return;

    } catch (error) {
        throw new Error("Fehler beim Löschen der Fahrt: " + error);
    }
}

export async function deleteFahrtMod(fahrt: FahrtResource): Promise<void> {
    try {
        if (!fahrt)
            throw new Error("Fahrt nicht definiert");

        const jwt = getJWT();
        if (!jwt)
            throw new Error("Kein JWT gefunden");

        const response = await fetch(`${BASE_URL}api/fahrt/mod/loesch/fahrt/${fahrt._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });

        if (!response.ok)
            throw new Error("Netzwerkantwort war nicht OK");

        return;

    } catch (error) {
        throw new Error("Fehler beim Löschen der Fahrt: " + error);
    }
}


