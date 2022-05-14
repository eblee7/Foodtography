import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../firebase/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function UpdateProfile() {
    const nameRef = useRef();
    const { currentUser, updateName } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const promises = [];
        setLoading(true);
        setError("");

        if (nameRef.current.value !== currentUser.displayName) {
            promises.push(updateName(nameRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                navigate("/account");
            })
            .catch(() => {
                setError("Failed to update account");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                ref={nameRef}
                                required
                                defaultValue={currentUser.displayName}
                            />
                        </Form.Group>
                        <Button
                            disabled={loading}
                            className="w-100"
                            type="submit"
                        >
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/account">Cancel</Link>
            </div>
        </>
    );
}
