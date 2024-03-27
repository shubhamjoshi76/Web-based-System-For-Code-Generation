import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { signIn } = UserAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await signIn(email, password);
		} catch (e) {
			setError(JSON.stringify(e, undefined, 2));
		}
	};

	return (
		<div>
			<div>
				<h1>Sign In</h1>
				<pre>{error && error}</pre>
				<p>
					Don't have an account yet? <Link to="/signup">Sign up.</Link>
				</p>
			</div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email Address</label>
					<input onChange={(e) => setEmail(e.target.value)} type="email" />
				</div>
				<div>
					<label>Password</label>
					<input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
					/>
				</div>
				<button>Sign In</button>
			</form>
		</div>
	);
};

export default SignIn;
