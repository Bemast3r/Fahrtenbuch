import { getJWT } from "../Components/Logincontext";
import { LoginResource, UserResource } from "../util/Resources";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;



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

        const response = await fetch(`${BASE_URL}/admin/users`, {
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
        const votedPosts = new Map<string, boolean>();
        result.votedPosts.forEach((obj: { postID: string, vote: boolean }) => { votedPosts.set(obj.postID, obj.vote); });
        result.votedPosts = votedPosts;
        return result as UserResource;

    } catch (error) {
        throw new Error("Error occurred during get: " + error);
    }
}

