import React, { Component } from "react";
import { ReactComponent as ArtSettings } from "../../assets/songs.svg";
import axios from "axios";
import getPackageJsonFromGithub from "get-package-json-from-github";

import Header from "../components/Header";
import Toggler from "../components/Toggler";
import LogCard from "./LogCard";
import Modal from "../components/Modal";

import "../../css/admin-css/settings.scss";

export default class AdminSettings extends Component {
	state = {
		log: [],
		settings: {},
		ping: 0,
		version: "",
		sentryErrors: 0,
		intervalDropdown: false,
		isActionProhibited: false,
		spoti: {
			status: false,
			username: null,
			devices: []
		}
	};

	componentDidMount() {
		// get settings
		axios
			.get("/api/settings/")
			.then((res) => {
				this.setState({ settings: res.data });
			})
			.catch((err) => console.error(err));

		// get log
		axios.get("/api/log/").then((r) => this.setState({ log: r.data }));

		// get ping
		const start = new Date();
		axios.get("https://playlist.jelszo.co").then((res) => {
			this.setState({ ping: new Date() - start });
		});

		// get spotify
		axios
			.get("/api/spotify/status/")
			.then((res) => {
				const parsedRes = JSON.parse(res);
				if (parsedRes === true) {
					this.setState({ spoti: { ...this.state.spoti, status: true } });
					axios
						.get("/api/spotify/username/")
						.then((res) => {
							this.setState({
								spoti: { ...this.state.spoti, username: res.data }
							});
						})
						.catch((e) => console.error(e.response));
					axios
						.get("/api/spotify/devices/")
						.then((res) => {
							this.setState({
								spoti: { ...this.state.spoti, devices: res.data }
							});
						})
						.catch((e) => console.error(e.response));
				} else if (res === false) {
					this.setState({ spoti: { ...this.state.spoti, status: false } });
				}
			})
			.catch((e) => console.error(e.response));

		// get sentry errors
		let url = "/api/sentry/";
		axios
			.get(url)
			.then((r) => this.setState({ sentryErrors: r.data }))
			.catch((e) => {
				console.error(e);
			});

		// get version
		getPackageJsonFromGithub(
			"git+https://github.com/jelszo-co/playlist.git"
		).then((packageJson) => {
			this.setState({ version: packageJson.version });
		});
	}

	toggleSwitch = (prop) => {
		let url,
			params = new URLSearchParams();
		url = `/api/settings/${prop.toLowerCase()}/`;
		params.append("value", !this.state.settings[prop]);
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.post(url, params)
			.then((res) => {
				const boolValue = JSON.parse(res.data.toLowerCase());
				this.setState({
					settings: { ...this.state.settings, [prop]: boolValue }
				});
			})
			.catch((err) => {
				if (err.response.status === 401) {
					this.setState({ isActionProhibited: true });
				}
				console.error(err);
			});
	};

	handleLimitChange = (e) => {
		this.setState({
			intervalDropdown: false,
			settings: { ...this.state.settings, [e.target.name]: e.target.value }
		});
	};

	toggleIntervalSelector = () => {
		this.setState({ intervalDropdown: !this.state.intervalDropdown });
	};

	changeNumber = (e) => {
		e.preventDefault();
		let url = "/api/settings/songlimit/",
			params = new URLSearchParams();
		params.append("number", this.state.settings.songLimitNumber);
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios
			.post(url, params)
			.then((res) => {
				this.setState({
					settings: { ...this.state.settings, songLimitNumber: res.data.number }
				});
				window.location.reload();
			})
			.catch((e) => {
				console.error(e);
			});
	};

	changeInterval = (interval) => {
		let url = "/api/settings/songlimit/";
		let params = new URLSearchParams();
		switch (interval) {
			case "15m":
				params.append("minute", 15);
				break;
			case "30m":
				params.append("minute", 30);
				break;
			case "1h":
				params.append("minute", 60);
				break;
			case "6h":
				params.append("minute", 360);
				break;
			case "1d":
				params.append("minute", 1440);
				break;
			default:
				params.append("minute", this.state.settings.songLimitMinute);
				break;
		}
		axios.defaults.xsrfCookieName = "csrftoken";
		axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
		axios.post(url, params).then((res) => {
			this.setState({
				settings: { ...this.state.settings, songLimitMinute: res.data.minute }
			});
			this.toggleIntervalSelector();
		});
	};

	spotiLogin = () => {
		window.location.href = "/api/spotify/login";
	};
	spotiLogout = () => {
		window.location.href = "https://www.spotify.com/hu/account/apps";
	};
	render() {
		const { log, ping, version, sentryErrors } = this.state;
		const {
			maintenance,
			canRequestSong,
			songLimitNumber,
			schoolDayOnly
		} = this.state.settings;
		const { status, username, devices } = this.state.spoti;
		let songLimitMinuteDisplay;
		switch (this.state.settings.songLimitMinute) {
			case 15:
				songLimitMinuteDisplay = "15 perc";
				break;
			case 30:
				songLimitMinuteDisplay = "30 perc";
				break;
			case 60:
				songLimitMinuteDisplay = "1 óra";
				break;
			case 360:
				songLimitMinuteDisplay = "6 óra";
				break;
			case 1440:
				songLimitMinuteDisplay = "1 nap";
				break;
			default:
				songLimitMinuteDisplay = "NaN";
		}
		let stylePing, styleSentry;
		if (ping <= 100) {
			stylePing = { color: "#139c61" };
		} else if (ping <= 200) {
			stylePing = { color: "#d5b900" };
		} else {
			stylePing = { color: "#92031B" };
		}
		if (sentryErrors === 0) {
			styleSentry = { color: "#139c61" };
		} else {
			styleSentry = { color: "#92031B" };
		}
		return (
			<div id="settings">
				<Modal
					toggler={this.state.isActionProhibited}
					title={"Ez nem fog menni..."}
					content={"Ehhez nincs jogod."}
				/>
				<Header kolcsey={false} />
				<h1 className="settings-heading">site settings</h1>
				<div className="settings-grid">
					<div className="settings-grid__maintenance">
						<h2>maintenance mode</h2>
						<Toggler
							toggle={this.toggleSwitch.bind(this, "maintenance")}
							state={maintenance}
						/>
					</div>
					<div className="settings-grid__music">
						<h2>zenekérés</h2>
						<div className="settings-grid__music__grid">
							<h3>Engedélyezve:</h3>
							<Toggler
								toggle={this.toggleSwitch.bind(this, "canRequestSong")}
								state={canRequestSong}
							/>
							<h3>Limit:</h3>
							<form onSubmit={this.changeNumber}>
								<p>
									<input
										type="number"
										name="songLimitNumber"
										value={songLimitNumber}
										onChange={this.handleLimitChange}
									/>
									/
									<button type="button" onClick={this.toggleIntervalSelector}>
										{songLimitMinuteDisplay}{" "}
										<i className="fas fa-chevron-down"></i>
									</button>
								</p>
								{this.state.intervalDropdown ? (
									<ul className="interval-dropdown">
										<li onClick={this.changeInterval.bind(this, "15m")}>
											15 perc
										</li>
										<li onClick={this.changeInterval.bind(this, "30m")}>
											30 perc
										</li>
										<li onClick={this.changeInterval.bind(this, "1h")}>
											1 óra
										</li>
										<li onClick={this.changeInterval.bind(this, "6h")}>
											6 óra
										</li>
										<li onClick={this.changeInterval.bind(this, "1d")}>
											1 nap
										</li>
									</ul>
								) : (
									""
								)}
							</form>
							<h3>Csak iskolaidőben:</h3>
							<Toggler
								toggle={this.toggleSwitch.bind(this, "schoolDayOnly")}
								state={schoolDayOnly}
							/>
						</div>
					</div>
					<div className="settings-grid__stats">
						<h2>statisztikák</h2>
						<div className="settings-grid__stats__grid">
							<h3>Szerveridő:</h3>
							<h4 style={stylePing}>{ping}ms</h4>
							<h3>Verzió:</h3>
							<h4>v{version}</h4>
							<h3>Sentry:</h3>
							<h4 style={styleSentry}>{sentryErrors} hiba</h4>
						</div>
					</div>
					<div
						className="settings-grid__spoti-login"
						onClick={status ? this.spotiLogout : this.spotiLogin}
					>
						<div
							className={`spoti-login__button ${
								status ? "spoti-btn-authed" : "spoti-btn-unauthed"
							}`}
						>
							<p>
								<i className="fab fa-spotify"></i>
								{status ? username : "bejelentkezés"}
							</p>
						</div>
					</div>
					<div className="settings-grid__spoti-devices">
						<h2>Spotify-eszközök</h2>
						<div className="spoti-devices__list">
							{devices.map((device) => {
								let deviceTypeClassName, styleDeviceIsActive;
								switch (device.type) {
									case "Computer":
										deviceTypeClassName = "desktop";
										break;
									case "Smartphone":
										deviceTypeClassName = "mobile";
										break;
									default:
										deviceTypeClassName = "question";
										break;
								}
								if (device.isSelected) {
									styleDeviceIsActive = { color: "#1ed761" };
								}
								return (
									<div className="spoti__device-card">
										<i className={`fas fa-${deviceTypeClassName}`}></i>
										<h5 style={styleDeviceIsActive}>
											{device.name}
											{device.isSelected ? (
												<i
													style={styleDeviceIsActive}
													className="far fa-check-circle"
												></i>
											) : null}
										</h5>
									</div>
								);
							})}
						</div>
					</div>
					<div className="settings-grid__log">
						<h2>Audit log</h2>
						{log.map((action) => {
							return <LogCard action={action} key={action.id} />;
						})}
					</div>
				</div>
				<ArtSettings className="settings-art" />
			</div>
		);
	}
}
