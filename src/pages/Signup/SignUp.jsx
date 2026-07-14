import { Link } from "react-router-dom";

function SignUp() {
	return (
		<div>
			<h1>Sign Up</h1>
			<p>Create a new account to get started.</p>
			<Link to="/login">Already have an account?</Link>
		</div>
	);
}

export default SignUp;
