import React from "react";
import { ReactComponent as Lock } from "../assets/lock-solid.svg";
import "../css/maintenance.scss";

const Maintenance = () => {
	return (
		<div id="maintenance">
			<a href="https://playlist.jelszo.co/admin/login">
				<Lock className="mt-lock" />
			</a>
			<div className="mt-content">
				<h1>playlist</h1>
				<p>
					Hali. Úgy tűnik, pont rossz időben érkeztél. Az oldal jelen
					pillanatban fejlesztés alatt áll.
				</p>
				<h3>Gyere vissza később!</h3>
			</div>
		</div>
	);
};

export default Maintenance;
