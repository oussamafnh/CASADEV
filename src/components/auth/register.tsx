import Github from "../../assets/svgs/github.auth";
import Google from "../../assets/svgs/google.auth";
import "../../style/register.css";


const RegisterForm = () => {
    return (
        <>
            <div className="registerform">
                <div className="form-container">
                    <p className="title">Welcome back</p>
                    <form className="form">
                        <input type="email" className="input" placeholder="Email" />
                        <input type="password" className="input" placeholder="Password" />
                        <button className="form-btn">Log in</button>
                    </form>
                    <p className="sign-up-label">
                        Don't have an account?<span className="sign-up-link">Sign up</span>
                    </p>
                    <div className="buttons-container">
                        <div className="apple-login-button">
                            <Github />
                            <span>Log in with Github</span>
                        </div>
                        <div className="google-login-button">
                            <Google />
                            <span>Log in with Google</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RegisterForm