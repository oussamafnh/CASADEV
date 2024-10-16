import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../style/register.css";

const RegisterForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between Sign Up and Sign In
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  }); // Form data state without username
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to toggle between Sign Up and Sign In
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setErrorMessage(""); // Reset error message when toggling
    setSuccessMessage(""); // Reset success message when toggling
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset errors before each request
    setSuccessMessage(""); // Reset success before each request

    // Validation
    if (!formData.email || !formData.password || (isSignUp && !formData.confirmPassword)) {
      setErrorMessage("All fields are required");
      return;
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/${isSignUp ? "signup" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            ...(isSignUp && { confirmPassword: formData.confirmPassword })
          }),
          credentials: 'include'
        }
      );

      const data = await response.json();
      console.log(data.user.isVerified); // Log the full response for debugging

      if (response.ok) {
        // Store token in session storage
        sessionStorage.setItem('token', data.token); // Store the token

        setSuccessMessage(isSignUp ? "User registered successfully" : "Logged in successfully");
        setErrorMessage("");
        setFormData({ email: "", password: "", confirmPassword: "" });
        if (data.user.isVerified === false) {
          navigate("/Profile_setup", { replace: true });
        } else {
          navigate("/", { replace: true });
          window.location.reload();
        }
      } else {
        if (response.status === 400) {
          setErrorMessage(data.error || "Some error occurred");
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
            {/* Removed username input */}
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
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
