import React, { Component } from "react";
import axios from "axios";
import { Transition, animated } from "react-spring/renderprops";

import { ReactComponent as Dots } from "../../assets/ellipsis-h-solid.svg";

import "../../css/admin-css/users.scss";

export default class UserCard extends Component {
	state = {
		banMenu: false,
		collapsed: true,
		initCustom: false,
		customInterval: ""
	};

	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};
	toggleBanMenu = () => {
		this.setState({ banMenu: !this.state.banMenu });
	};
	ban = (period) => {
		let url = "/api/blockuser/";
		let params = new URLSearchParams();
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		params.append("userid", this.props.user.userid);
		switch (period) {
			case "1w":
				params.append("permanent", false);
				params.append("expirein", 1);
				break;
			case "1m":
				params.append("permanent", false);
				params.append("expirein", 4);
				break;
			case "3m":
				params.append("permanent", false);
				params.append("expirein", 12);
				break;
			case "p":
				params.append("permanent", true);
				break;
			case "c":
				params.append("expirein", this.state.customInterval);
				params.append("permanent", false);
				break;
			default:
				params.append("permanent", true);
		}
		axios
			.post(url, params)
			.then((res) => {
				window.location.reload();
			})
			.catch((err) => {
				console.error(err);
				console.error(err.response);
				console.error(err.response.status);
			});
	};
	unBan = () => {
		let url = "/api/unban/";
		let params = new URLSearchParams();
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		params.append("userid", this.props.user.userid);
		axios
			.post(url, params)
			.then((res) => {
				window.location.reload();
			})
			.catch((err) => {
				console.error(err.response.status);
			});
	};

	initCustom = () => {
		this.setState({ initCustom: true });
	};

	setInterval = (e) => {
		this.setState({ customInterval: e.target.value });
	};

	render() {
		const { user, isUnban } = this.props;
		const { banMenu, collapsed } = this.state;
		let styleCard, styleCardElements, styleBan;
		if (collapsed) {
			styleCard = {
				height: "100px"
			};
			styleCardElements = {
				display: "none"
			};
		} else {
			styleCardElements = {
				display: "block"
			};
			styleCard = {
				height: "350px"
			};
		}

		if (banMenu) {
			styleBan = { display: "block" };
		} else {
			styleBan = { display: "none" };
		}

		return (
			<div className="usc" style={styleCard}>
				<div className="usc__heading">
					<Dots className="usc-dots" onClick={this.toggleCollapse} />
					<h3 className="userid">User id: {user.userid}</h3>
					<h3 className="lastmusic">
						Legutóbbi zene:{" "}
						<span>
							{user.songs[0].artist} - {user.songs[0].title}
						</span>
					</h3>
				</div>
				<h2 style={styleCardElements}>Beküldött zenék:</h2>
				<div className="usc__songs" style={styleCardElements}>
					{user.songs.map((sg) => {
						return (
							<div className="user-song-card" key={sg.id}>
								<h1>{sg.artist}</h1>
								<span />
								<h1>{sg.title}</h1>
							</div>
						);
					})}
				</div>
				{!isUnban ? (
					<div className="ban-wrapper">
						<button
							id="ban"
							style={styleCardElements}
							onClick={this.toggleBanMenu}
						>
							BAN
						</button>
						<Transition
							native
							items={this.state.banMenu}
							from={{ opacity: 0 }}
							enter={{ opacity: 1 }}
							leave={{ opacity: 0 }}
							config={{ duration: 200 }}
						>
							{(show) =>
								show &&
								((props) => (
									<animated.div style={props}>
										<div className="usc_ban-menu" style={styleBan}>
											<ul>
												<li onClick={this.ban.bind(this, "1w")}>
													<p>1 hét</p>
												</li>
												<li onClick={this.ban.bind(this, "1m")}>
													<p>1 hónap</p>
												</li>
												<li onClick={this.ban.bind(this, "3m")}>
													<p>3 hónap</p>
												</li>
												<li onClick={this.ban.bind(this, "p")}>
													<p>Végleges</p>
												</li>
												<li id="usc_ban-custom">
													{this.state.initCustom ? (
														<form onSubmit={this.ban.bind(this, "c")}>
															<input
																type="number"
																name="interval"
																value={this.state.customInterval}
																onChange={this.setInterval}
															/>{" "}
															<p onClick={this.ban.bind(this, "c")}>hét</p>
														</form>
													) : (
														<p
															className="usc_ban-custom__flavor"
															onClick={this.initCustom}
														>
															Egyéni
														</p>
													)}
												</li>
											</ul>
										</div>
									</animated.div>
								))
							}
						</Transition>
					</div>
				) : (
					<div className="ban-wrapper ban-wrapper__unban">
						<button id="ban" style={styleCardElements} onClick={this.unBan}>
							UNBAN
						</button>
						<p>Lejár: {user.block.isPerma ? "soha" : user.block.ExpireIn}</p>
					</div>
				)}
			</div>
		);
	}
}
