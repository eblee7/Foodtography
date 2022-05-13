import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signInWithGoogle, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/account");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false)
  }

  async function signInUsingGoogleAccount() {
    try{
      setLoading(true);
      await signInWithGoogle();
      navigate("/account");
    } catch {
      setError("Failed to create an account");
    }
  }

  useEffect(() => {
      if(currentUser) return navigate("/account");
  }, [currentUser])
  

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="login__container">
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="login__btn" type="submit">
              Log In
            </Button>
            <Button className="login__btn login__google" onClick={signInUsingGoogleAccount}>
              Login with Google
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/reset">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="/signup">Register</Link>
      </div>
    </>
  )
}

export default SignIn;
