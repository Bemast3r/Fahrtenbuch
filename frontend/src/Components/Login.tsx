import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import Loading from "./LoadingIndicator";
import { login } from "../Api/api";
import { getJWT, setJWT } from "./Logincontext";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [error, setError] = useState("")
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()


    const jwt = getJWT()

    useEffect(() => {
        if (jwt) {
            setJWT(jwt)
            navigate("/home")
        } else {
            return;
        }
    }, [jwt])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const jwt = await login({ username: inputUsername, password: inputPassword })
            setJWT(jwt.access_token)
            navigate("/home") // User wird redirected nachdem Login
        } catch (error: any) {
            setShow(true)
            setError(error.toString())
        }
        setLoading(false);
    };

    const handlePassword = () => { };

    return (
        <div
            className="sign-in__wrapper"
            style={{}}
        >
            {/* Overlay */}
            <div className="sign-in__backdrop"></div>
            {/* Form */}
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                {/* Header */}
                {/* <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={Logo}
                    alt="logo"
                /> */}
                <div className="h4 mb-2 text-center">SKM - Fahrtenbuch</div>
                <div className="h4 mb-2 text-center">Anmelden</div>
                {/* ALert */}
                {show ? (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        {error}
                    </Alert>
                ) : (
                    <div />
                )}
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputUsername}
                        placeholder="Username"
                        onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Password"
                        onChange={(e) => setInputPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* <Form.Group className="mb-2" controlId="checkbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group> */}
                {!loading ? (
                    <Button className="w-100" variant="primary" type="submit">
                        Log In
                    </Button>
                ) : (
                    <Loading />
                )}
                <div className="d-grid justify-content-end">
                    <Button
                        className="text-muted px-0"
                        variant="link"
                        onClick={handlePassword}
                    >
                        Forgot password?
                    </Button>
                </div>
            </Form>
            {/* Footer */}
            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                ESKM | &copy;2024
            </div>
        </div>
    );
};

export default Login;
