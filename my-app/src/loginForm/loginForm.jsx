import React from "react";
import "./loginForm.css";
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

const LoginForm = () => {
  return (
    <div className="login-form"> 
        <form action="">
            <h1>Login</h1>
            <div className="input-container">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required placeholder="Username" />
                <FaUser className="icon" />
            </div>
            <div className="input-container">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="Password" />
                <MdOutlinePassword className="icon" />
            </div>
            <div className="remeber forget">
                <label className="custom-checkbox" htmlFor="remember">
                    <input type="checkbox" id="remember" name="remember" />
                    <span className="checkmark" aria-hidden="true" />
                </label>
                <label htmlFor="remember">Remember me</label>
                <a href="#">Forgot password?</a>
            </div>
            <div className="signup">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
  );
};

export default LoginForm;
