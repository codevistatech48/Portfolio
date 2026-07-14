import { Link } from "react-router-dom";

function Login() {
	return (
		<div>
			<h1>Login</h1>
			<p>Welcome back. Please sign in to continue.</p>
			<Link to="/signup">Create an account</Link>
		</div>
	);
}

export default Login;
