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
        throw String("Something went wrong when connecting to the server, please try again later.");
    if (response.status === 400 || response.status === 401)
        throw String("Your login details are incorrect, please try again.");
    if (response.status === 403)
        throw String("Your account is not verified yet. Please click on the link in the confirmation mail to verify your account.");
    if (response.status === 405)
        throw String("The server encountered an unknown error, pleasy try again later.");
    if (response.status !== 201){
        alert(response.status)
        throw String("An error occurred, please try again.");
    }
    const result: LoginResource = await response.json();
    if (!result.access_token || !result.token_type)
        throw String("The server returned an invalid response, please try again later.");
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

