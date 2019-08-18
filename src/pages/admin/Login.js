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

	onSubmit = (e) => {
		// e.preventDefault();
	};
	render() {
		const { name, password } = this.state;
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
					<form
						// onSubmit={this.onSubmit}
						action="/api/login"
						method="post"
					>
						<input
							type="text"
							name="name"
							// value={name}
							placeholder="Felhasználónév"
							// onChange={this.onChange}
							required
						/>
						<input
							type="password"
							name="password"
							// value={password}
							placeholder="Jelszó"
							// onChange={this.onChange}
							required
						/>
						<div className="submit">
							<input type="submit" value="" />
							<i className="fas fa-arrow-right" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}
