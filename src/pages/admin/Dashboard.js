import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../../css/admin-css/dashboard.scss";

export default class AdminDashboard extends Component {
	render() {
		return (
			<div id="dashboard">
				<Link to="/admin/songs">
					<h1>Manage Songs</h1>
				</Link>
				<Link to="/new">
					<h1>New</h1>
				</Link>
				<a href="https://playlist.jelszo.co/api/logout/">
					<h1>Logout</h1>
				</a>
				<Link to="/admin/users">
					<h1>Users</h1>
				</Link>
			</div>
		);
	}
}