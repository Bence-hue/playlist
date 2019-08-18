import React, { Component } from "react";
import Header from "../components/Header";

import "../../css/admin-css/login.scss";

import { ReactComponent as LoginBanner } from "../../assets/Login-art.svg";

export default class AdminLogin extends Component {
	state = {
		name: "",
		password: ""
	};

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		return (
			<div>
				<Header kolcsey={true} />
				<LoginBanner className="login-banner" />
				<div id="login-wrapper">
					<h1>
						<span>Admin</span>
						<br />
						Bejelentkezés
					</h1>
					<form action="/api/login" method="post">
						<input
							type="text"
							name="name"
							placeholder="Felhasználónév"
							required
						/>
						<input
							type="password"
							name="password"
							placeholder="Jelszó"
							required
						/>
						<button type="submit" value="">
							<i className="fas fa-arrow-right" />
						</button>
					</form>
				</div>
			</div>
		);
	}
}
