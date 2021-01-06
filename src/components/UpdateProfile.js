import {Form, Button, Card, Alert} from "react-bootstrap";
import React, {useRef, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {Link, useHistory} from "react-router-dom";

function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const {updatePassword, updateEmail, currentUser, updateUserDoc} = useAuth();
    const history = useHistory();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== confirmPasswordRef.current.value){
            return setError("Passwords do not match");
        }

        setLoading(true);

        const promises =[];
        if(emailRef.current.value !== currentUser.email){
            promises.push(updateEmail(emailRef.current.value));
        }
        if(passwordRef.current.value){
            promises.push(updatePassword(passwordRef.current.value));
        }

        const values = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value
        }

        promises.push(updateUserDoc(values));

        Promise.all(promises).then( () =>{
            history.push("/");
        }).catch( () => {
            setError("Failed to update account")
        }).finally( () => {
            setLoading(false);
        })
    }

    return (
        <>
            <Card>
                <h2 className="text-center mb-4">Update Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="test" ref={firstNameRef} defaultValue={currentUser.displayName.split(" ")[0]}/>
                    </Form.Group>
                    <Form.Group id="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" ref={lastNameRef} defaultValue={currentUser.displayName.split(" ")[1]}/>
                    </Form.Group>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep same password"/>
                    </Form.Group>
                    <Form.Group id="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={confirmPasswordRef} placeholder="Leave blank to keep same password"/>
                    </Form.Group>
                    <Button disabled={loading} type="submit" className="w-100">Update</Button>
                </Form>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Cancel</Link>
            </div>
        </>
    );
}

export default UpdateProfile;
