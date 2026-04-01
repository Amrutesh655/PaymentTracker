import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // ✅ remove user
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>💰 MoneyTracker</h2>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 20px",
    background: "#111827",
    color: "white",
    alignItems: "center",
  },
  logo: {
    margin: 0,
  },
  logout: {
    background: "#ef4444",
    border: "none",
    padding: "8px 14px",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default Navbar;