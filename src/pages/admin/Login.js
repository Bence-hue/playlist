import React, { Component } from "react";
import Header from "../components/Header";
import queryString from "query-string";

import "../../css/admin-css/login.scss";

import { ReactComponent as LoginBanner } from "../../assets/Login-art.svg";

import Modal from "../components/Modal";
export default class AdminLogin extends Component {
	state = {
		username: "",
		password: "",
		noauthModal: false,
		remember: false
	};

	componentDidMount() {
		const urlParams = queryString.parse(this.props.location.search);

		if (urlParams.badauth === "true") {
			this.setState({ noauthModal: true });
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	hideModal = () => {
		this.setState({ noauthModal: false });
	};

	handleRememberClick = (e) => {
		this.setState({ remember: !this.state.remember });
	};

	render() {
		const { noauthModal } = this.state;
		return (
			<div>
				<Modal toggler={noauthModal} title={"Hibás jelszó!"} content={"Szép próbálkozás.😉"} />
				<div className="login-page" />
				<Header kolcsey={true} />
				<LoginBanner className="login-banner" style={{ opacity: 1, zIndex: -100 }} />
				<div id="login-wrapper">
					<h1>
						<span>Admin</span>
						<br />
						Bejelentkezés
					</h1>
					<form
						action="/api/login/"
						method="post"
						autoComplete="off"
						remember={this.state.remember}
					>
						<input type="text" name="username" placeholder="Felhasználónév" required />
						<input type="password" name="password" placeholder="Jelszó" required />
						<button type="submit" value="">
							<i className="fas fa-arrow-right" />
						</button>
						<div className="chx">
							<input
								type="checkbox"
								name="remember"
								id="remember"
								onClick={this.handleRememberClick}
								checked={this.state.remember}
							/>
							<label for="remember">Emlékezz rám</label>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
