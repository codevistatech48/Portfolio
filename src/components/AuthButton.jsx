function AuthButton() {
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  if (token) {
    return (
      <button className="login-btn" onClick={handleLogout}>
        Logout
      </button>
    );
  }

  return (
    <button className="login-btn">
      Sign In
    </button>
  );
}

export default AuthButton;