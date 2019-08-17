import React, { Component } from "react";
import Header from "../components/Header";

import "../../css/admin-css/login.scss";

export default class AdminLogin extends Component {
	state = {
		name: null,
		pass: null
	};

	onSubmit = (e) => {
		e.preventDefault();
	};
	render() {
		return (
			<div>
				<Header kolcsey={true} />
				<div id="login-wrapper">
					<h1>
						<span>Admin</span>
						<br />
						Bejelentkezés
					</h1>
					<form onSubmit={this.onSubmit}>
						<input type="text" name="name" placeholder="Felhasználónév" />
						<input type="password" name="pass" placeholder="Jelszó" />
						<div className="submit">
							<i class="fas fa-arrow-right" />
							<input type="submit" value="" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}
