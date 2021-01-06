import {Form, Button, Card, Alert} from "react-bootstrap";
import React, {useRef, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {Link, useHistory} from "react-router-dom";

function SignUp() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const {signup} = useAuth();
    const history = useHistory();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== confirmPasswordRef.current.value){
            return setError("Passwords do not match");
        }

        try{
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch (e) {
            setError("Failed to create an account");
        }
        setLoading(false);
    }

    return (
        <>
            <Card>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required/>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required/>
                    </Form.Group>
                    <Form.Group id="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={confirmPasswordRef} required/>
                    </Form.Group>
                    <Button disabled={loading} type="submit" className="w-100">Sign Up</Button>
                </Form>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </>
    );
}

export default SignUp;
