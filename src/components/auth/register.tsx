import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from '../Alert';
import "../../style/register.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setAlert(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    setLoading(true);

    if (!formData.email || !formData.password || (isSignUp && !formData.confirmPassword)) {
      setLoading(false);
      setAlert({ message: "All fields are required", type: "error" });
      return;
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setLoading(false);
      setAlert({ message: "Passwords do not match", type: "error" });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT_URL}/api/auth/${isSignUp ? "signup" : "login"}`,
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
      console.log(data);

      if (response.ok) {

        setAlert({
          message: isSignUp ? "User registered successfully" : "Logged in successfully",
          type: "success"
        });

        setFormData({ email: "", password: "", confirmPassword: "" });

        if (data.user.isVerified === false) {
          navigate("/Profile_setup", { replace: true });
        } else {
          navigate("/", { replace: true });
          window.location.reload();
        }
      } else {
        setLoading(false);
        setAlert({ message: data.error || "Some error occurred", type: "error" });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ message: "An unexpected error occurred", type: "error" });
    }
  };

  return (
    <>
      <div className="registerform">
        <div className={`form-container ${isSignUp ? "signup" : "signin"}`}>
          <p className="title">{isSignUp ? "Join us" : "Welcome back"}</p>

          <form className="form" onSubmit={handleSubmit}>
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
            <button className="form-btn" disabled={loading}>
              {loading ? (
                <svg viewBox="25 25 50 50" className="spinner">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              ) : isSignUp ? "Sign up" : "Sign in"}
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
                Don't have an account?{" "}
                <span className="sign-up-link" onClick={toggleForm}>
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </>
  );
};
export default RegisterForm;
