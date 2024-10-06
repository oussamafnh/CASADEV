import { useState } from "react";
import Github from "../../assets/svgs/github.auth";
import Google from "../../assets/svgs/google.auth";
import "../../style/register.css";

const RegisterForm = () => {
  const [isSignUp, setIsSignUp] = useState(true); // toggle between Sign Up and Sign In
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }); // form data state
  const [errorMessage, setErrorMessage] = useState(""); // error message state
  const [successMessage, setSuccessMessage] = useState(""); // success message state

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to toggle between Sign Up and Sign In
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setErrorMessage(""); // reset error message when toggling
    setSuccessMessage(""); // reset success message when toggling
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // reset errors before each request
    setSuccessMessage(""); // reset success before each request

    // Validation
    if (!formData.email || !formData.password || (isSignUp && !formData.username)) {
      setErrorMessage("All fields are required");
      return;
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add credentials if needed (useful if your backend is using cookies for sessions)
          "Accept": "application/json", // Ensure the server returns JSON format
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("User registered successfully");
        setErrorMessage("");
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        setIsSignUp((prev) => !prev);

      } else {
        // Handle errors based on the status codes
        if (response.status === 400) {
          if (data.error === "User already exists") {
            setErrorMessage("User already exists");
          } else if (data.error === "Passwords do not match") {
            setErrorMessage("Passwords do not match");
          } else {
            setErrorMessage(data.error);
          }
        } else {
          setErrorMessage("Some server error");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <>
      <div className="registerform">
        <div className={`form-container ${isSignUp ? "signup" : "signin"}`}>
          <p className="title">{isSignUp ? "Join us" : "Welcome back"}</p>



          <form className="form" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                className="input"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
              />
            )}
            <input
              type="email"
              className="input"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="password"
              className="input"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            {isSignUp && (
              <input
                type="password"
                className="input"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Password confirmation"
              />
            )}

            {/* Display error message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Display success message */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button className="form-btn">
              {isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>

          <p className="sign-up-label">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span className="sign-up-link" onClick={toggleForm}>
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span className="sign-up-link" onClick={toggleForm}>
                  Sign up
                </span>
              </>
            )}
          </p>

          <div className="buttons-container">
            <div className="apple-login-button">
              <Github />
              <span>{isSignUp ? "Sign up" : "Sign in"} with Github</span>
            </div>
            <div className="google-login-button">
              <Google />
              <span>{isSignUp ? "Sign up" : "Sign in"} with Google</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
