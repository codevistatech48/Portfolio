import { Link } from "react-router-dom";

function AuthButton() {
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  return (
    <>
      {token ? (
        <button onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
    </>
  );
}

export default AuthButton;