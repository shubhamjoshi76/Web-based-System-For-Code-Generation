import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { createUser } = UserAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await createUser(email, password);
		} catch (e) {
			setError(JSON.stringify(e, undefined, 2));
		}
	};

	return (
		<div>
			<div>
				<h1>Sign Up</h1>
				<pre>{error && error}</pre>
				<p>
					Already have an account ! <Link to="/">Sign in</Link>
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
				<button>Sign Up</button>
			</form>
		</div>
	);
};

export default SignUp;
