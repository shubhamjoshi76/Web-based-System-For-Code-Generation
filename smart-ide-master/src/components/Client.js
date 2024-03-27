import React from "react";

const Client = ({ username, photo }) => {
	return (
		<div className="client">
			<img src={photo} alt={username} />
			<span>{username}</span>
		</div>
	);
};

export default Client;
