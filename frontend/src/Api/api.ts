import { LoginResource } from "../util/Resources";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;



export async function login(loginData: { email: string, password: string }): Promise<LoginResource> {
    if (!loginData.email)
        throw new Error("email not defined");
    if (!loginData.password)
        throw new Error("password not defined");

    const response = await fetch(`http://localhost:5000/api/login/`, {
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
