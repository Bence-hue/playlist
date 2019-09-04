import React from "react";
import { ReactComponent as Lock } from "../assets/lock-solid.svg";

const Maintenance = () => {
	return (
		<div>
			<Lock />
			<h1>playlist</h1>
			<p>
				Hali. Úgy tűnik, pont rossz időben érkeztél. Az oldal jelen pillanatban
				fejlesztés alatt áll.
			</p>
			<h3>Gyere vissza később!</h3>
		</div>
	);
};

export default Maintenance;
