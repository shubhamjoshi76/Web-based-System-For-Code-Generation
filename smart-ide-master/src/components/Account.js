import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";

const Account = () => {
	const { user, logout } = UserAuth();
	const [error, setError] = useState("");

	const handleLogout = async () => {
		setError("");
		try {
			await logout();
		} catch (e) {
			setError(JSON.stringify(e, undefined, 2));
		}
	};

	return (
		<main>
			<section id="tilt">
				<Tilt
					className="parallax-effect"
					perspective={2000}
					glareEnable={true}
					glareMaxOpacity={0.5}
					glareColor="#ffffff"
					glarePosition="center"
					glareBorderRadius="2.5dvmin">
					<div className="inner-element">
						<div>
							{user && (
								<>
									<h1>Account</h1>
									<pre>{error && error}</pre>
									<img src={user.photoURL} alt="photoURL" />
									<pre>{JSON.stringify(user, undefined, 2)}</pre>
									<button onClick={handleLogout}>Logout</button>
								</>
							)}
						</div>
					</div>
				</Tilt>
			</section>
		</main>
	);
};

export default Account;
