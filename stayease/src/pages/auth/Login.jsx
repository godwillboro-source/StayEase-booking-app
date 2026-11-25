import React, { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../../context/useAuth";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";

function Login() {
  const { login, currentUser, loading, error: authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.state?.from;

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  if (currentUser) {
    return (
      <Navigate
        to={returnTo || `/${currentUser.role}/dashboard`}
        replace
      />
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(returnTo || `/${result.user.role}/dashboard`, {
      replace: true
    });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="auth-brand-symbol">S</span>

          <h1>Welcome back</h1>

          <p>Log in to continue to your StayEase account.</p>
        </div>

        <ErrorMessage message={error || authError} />

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Log in
          </Button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

      </div>
    </section>
  );
}

export default Login;