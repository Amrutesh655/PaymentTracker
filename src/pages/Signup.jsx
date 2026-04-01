import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../utils/Storage";
import "../Styles/Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return alert("Please fill all fields");
    }

    setLoading(true);

    setTimeout(() => {
      const res = signup({ name, email, password });

      if (res.success) {
        alert("Signup successful");
        navigate("/");
      } else {
        alert(res.message);
      }

      setLoading(false);
    }, 500);
  };

  return (
    <div className="signup-page">
      <div className="signup-glow" />

      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-icon">Signup</div>
          <h2 className="signup-title">Create Account</h2>
          <p>Start managing your money</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="Full Name"
            className="signup-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="signup-button">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;