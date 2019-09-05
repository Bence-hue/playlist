import React, { Component } from "react";
import { ReactComponent as ArtSettings } from "../../assets/songs.svg";

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
		ping: 24,
		version: "v1.0.2",
		sentryErrors: 6
	};
	render() {
		const { log, ping, version, sentryErrors } = this.state;
		return (
			<div id="settings">
				<Header kolcsey={false} />
				<h1 className="settings-heading">site settings</h1>
				<div className="settings-grid">
					<div className="settings-grid__maintenance">
						<h2>maintenance mode</h2>
						<Toggler toggle={this.toggleMtMode} state={false} />
					</div>
					<div className="settings-grid__music">
						<h2>zenekérés</h2>
						<div className="settings-grid__music__grid">
							<h3>Engedélyezve:</h3>
							<Toggler toggle={this.toggleMusicQuery} state={true} />
							<h3>Limit:</h3>
							<form onSubmit={this.onSubmit}>
								<input
									type="text"
									name="limit"
									value="3"
									onChange={this.handleLimitChange}
								/>
							</form>
							<h3>Explicit filter:</h3>
							<Toggler toggle={this.toggleExplicit} state={false} />
						</div>
					</div>
					<div className="settings-grid__stats">
						<h2>statisztikák</h2>
						<div className="settings-grid__stats__grid">
							<h3>Szerveridő:</h3>
							<h4>{ping}ms</h4>
							<h3>Verzió:</h3>
							<h4>{version}</h4>
							<h3>Sentry:</h3>
							<h4>{sentryErrors} hiba</h4>
						</div>
					</div>
					<div className="settings-grid__log">
						<h2>Audit log</h2>
						{log.map((action) => {
							return <LogCard action={action} id={action.id} />;
						})}
					</div>
				</div>
				<ArtSettings className="settings-art" />
			</div>
		);
	}
}
