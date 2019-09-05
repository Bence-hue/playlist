import React, { Component } from "react";
import Header from "../components/Header";
import queryString from "query-string";

import "../../css/admin-css/login.scss";

import { ReactComponent as LoginBanner } from "../../assets/Login-art.svg";
import { ReactComponent as Circle } from "../../assets/circle-solid.svg";
import { ReactComponent as Times } from "../../assets/times-solid.svg";

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
				<div className="login-page" />
				{noauthModal ? (
					<div id="noauth">
						<div className="noauth-modal">
							<div
								className="noauth-modal__button-wrapper"
								onClick={this.hideModal}
							>
								<Circle className="noauth-modal-button-icon noauth-circle" />
								<Times className="noauth-modal-button-icon noauth-times" />
							</div>
							<div className="noauth-modal__content">
								<h2>Hibás jelszó!</h2>
								<div className="noauth-modal__span" />
								<p>
									Szép próbálkozás.{" "}
									<span
										role="img"
										aria-label="winking face"
										style={{ fontStyle: "normal" }}
									>
										😉
									</span>
								</p>
							</div>
						</div>
					</div>
				) : (
					""
				)}
				<Header kolcsey={true} />
				<LoginBanner
					className="login-banner"
					style={{ opacity: 1, zIndex: -100 }}
				/>
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
						<input
							type="text"
							name="username"
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
