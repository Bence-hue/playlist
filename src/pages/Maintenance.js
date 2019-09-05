import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Lock } from "../assets/lock-solid.svg";
import "../css/maintenance.scss";

const Maintenance = () => {
	return (
		<div id="maintenance">
			<Link to="/admin/login">
				<Lock className="mt-lock" />
			</Link>
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
