import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/Storage";
import "../Styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const res = login({ email, password });

      if (res.success) {
        navigate("/dashboard");
      } else {
        alert(res.message);
      }

      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-glow" />

      <div className="login-card">
        <div className="login-logo">
          <div className="login-icon">LOGIN</div>
          <h2>MoneyTracker</h2>
          <p>Secure access to your wealth</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          New here?
          <Link to="/signup" className="login-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;