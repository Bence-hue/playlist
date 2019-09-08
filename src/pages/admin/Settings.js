import React, { Component } from "react";
import { ReactComponent as ArtSettings } from "../../assets/songs.svg";
import axios from "axios";
import getPackageJsonFromGithub from "get-package-json-from-github";

import Header from "../components/Header";
import Toggler from "../components/Toggler";
import LogCard from "./LogCard";

import "../../css/admin-css/settings.scss";

export default class AdminSettings extends Component {
	state = {
		log: [
			{
				id: 1,
				type: "ban",
				name: "test-ban",
				time: "tegnap",
				userid: "NaaaaaaaN"
			},
			{
				id: 2,
				type: "unban",
				name: "test-unban",
				time: "tegnap",
				userid: "NaaaaaaaN"
			},
			{
				id: 3,
				type: "delete",
				name: "test-del",
				time: "tegnap",
				artist: "del-artist",
				title: "del-title"
			},
			{
				id: 4,
				type: "modify",
				name: "test-switch",
				time: "tegnap",
				switch: "mod-switch",
				state: "on"
			}
		],
		settings: {},
		ping: 0,
		version: "",
		sentryErrors: 6,
		intervalDropdown: false
	};

	componentDidMount() {
		// get settings
		axios
			.get("/api/settings/")
			.then((res) => {
				this.setState({ settings: res.data });
			})
			.catch((err) => console.error(err));

		// get ping
		const start = new Date();
		axios.get("https://playlist.jelszo.co").then((res) => {
			this.setState({ ping: new Date() - start });
		});

		// get sentry errors
		let key,
			url =
				"https://sentry.io/api/0/projects/jelszo-co/playlist-frontend/stats/";
		console.log(key);

		fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${key}`
			}
		})
			.then((r) => console.log(r))
			.catch((error) => {
				console.error(error);
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

		axios
			.post(url, params)
			.then((res) => {
				const boolValue = JSON.parse(res.data.toLowerCase());
				this.setState({
					settings: { ...this.state.settings, [prop]: boolValue }
				});
			})
			.catch((err) => {
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
		axios.post(url, params).then((res) => {
			this.setState({
				settings: { ...this.state.settings, songLimitNumber: res.data.number }
			});
			window.location.reload();
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
		axios.post(url, params).then((res) => {
			this.setState({
				settings: { ...this.state.settings, songLimitMinute: res.data.minute }
			});
		});
	};
	render() {
		const { log, ping, version, sentryErrors } = this.state;
		const {
			maintenance,
			canRequestSong,
			songLimitNumber,
			schoolDayOnly
		} = this.state.settings;
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
							<h4>{version}</h4>
							<h3>Sentry:</h3>
							<h4 style={styleSentry}>{sentryErrors} hiba</h4>
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
