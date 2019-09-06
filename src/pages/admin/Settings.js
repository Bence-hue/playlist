import React, { Component } from "react";
import { ReactComponent as ArtSettings } from "../../assets/songs.svg";
import axios from "axios";

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
		limit: 3,
		ping: 0,
		version: "v1.0.2",
		sentryErrors: 6,
		mtMode: false,
		musicQuery: true
	};

	componentDidMount() {
		// get ping
		const start = new Date();
		axios.get("https://playlist.jelszo.co").then((res) => {
			this.setState({ ping: new Date() - start });
		});

		// get sentry errors
		axios
			.get("https://sentry.io/api/0/projects/", {
				headers: {
					Authorization:
						"Bearer 4626e357a3bd49258380c7fc589e72cd405433c9a9924e3e97cd295b379735d2"
				}
			})
			.then((res) => {
				console.log(res.data);
			});
	}

	toggleSwitch = (prop) => {
		let url, params;
		switch (prop) {
			case "mtMode":
				url = "/api/togglemaintenance/";
				params = !this.state.mtMode;
				break;
			case "musicQuery":
				url = "/api/togglequery/";
				params = !this.state.musicQuery;
				break;
			case "explicit":
				url = "/api/toggleexplicit/";
				params = !this.state.explicit;
				break;
			default:
				break;
		}
		axios
			.post(url, params)
			.then((res) => {
				// const switchState = this.state[prop];
				this.setState({ [prop]: res.data });
			})
			.catch((err) => {
				console.error(err);
			});
	};

	handleLimitChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const {
			log,
			ping,
			version,
			sentryErrors,
			mtMode,
			musicQuery,
			explicit
		} = this.state;
		let stylePing, styleSentry;
		if (ping <= 50) {
			stylePing = { color: "#139c61" };
		} else if (ping <= 100) {
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
							toggle={this.toggleSwitch.bind(this, "mtMode")}
							state={mtMode}
						/>
					</div>
					<div className="settings-grid__music">
						<h2>zenekérés</h2>
						<div className="settings-grid__music__grid">
							<h3>Engedélyezve:</h3>
							<Toggler
								toggle={this.toggleSwitch.bind(this, "musicQuery")}
								state={musicQuery}
							/>
							<h3>Limit:</h3>
							<form onSubmit={this.onSubmit}>
								<input
									type="number"
									name="limit"
									value={this.state.limit}
									onChange={this.handleLimitChange}
								/>
							</form>
							<h3>Explicit filter:</h3>
							<Toggler
								toggle={this.toggleSwitch.bind(this, "explicit")}
								state={explicit}
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
