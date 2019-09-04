import React, { Component } from "react";

import Header from "../components/Header";
import Toggler from "../components/Toggler";
import LogCard from "./LogCard";

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
			<div>
				<Header kolcsey={false} />
				<h1>site settings</h1>
				<div className="settings-grid">
					<div className="settings-grid__maintenance">
						<h2>maintenance mode</h2>
						<Toggler toggle={this.toggleMtMode} state={false} />
					</div>
					<div className="settings-grid__music">
						<h1>zenekérés</h1>
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
						<h1>statisztikák</h1>
						<div className="settings-grid__stats__grid">
							<h3>Szerveridő:</h3>
							<h2>{ping}ms</h2>
							<h3>Verzió:</h3>
							<h2>{version}</h2>
							<h3>Sentry:</h3>
							<h2>{sentryErrors} hiba</h2>
						</div>
					</div>
					<div className="settings-grid__log">
						<h1>Audit log</h1>
						{log.map((action) => {
							return <LogCard action={action} id={action.id} />;
						})}
					</div>
				</div>
			</div>
		);
	}
}
