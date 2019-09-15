import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LogCard extends Component {
	state = {
		showStacked: false
	};

	toggleStacked = () => {
		this.setState({ showStacked: !this.state.showStacked });
	};
	render() {
		/*
		action: {
			type: ban | unban | delete | played | modify
			name: user who committed the changes
			time: date when the change ocurred

			event: stacked event group

		c	content
		}*/
		const { user, time, events, eventCount } = this.props.action;
		if (events) {
			return (
				<div className="stack">
					<div className="stack__header">
						<h3>{this.getTypeName("stacked")}</h3>
						<p>
							<span>{eventCount}</span> esemény
						</p>
						<i className="fas fa-chevron-down" onClick={this.toggleStacked}></i>
					</div>
					{events.map((action) => {
						const getEventContent = () => {
							switch (this.props.action.type) {
								case "ban":
									return (
										<Link
											to={`/admin/users/#${JSON.parse(action.content).userid}`}
										>{`UserId: ${JSON.parse(action.content).userid}`}</Link>
									);
								case "unban":
									return (
										<Link
											to={`/admin/users/#${action.content}`}
										>{`UserId: ${action.content}`}</Link>
									);
								case "deleted":
									return <h4 style={{ color: "#92031B" }}>{action.content}</h4>;
								case "played":
									return <h4 style={{ color: "#139c61" }}>{action.content}</h4>;
								case "modify":
									return <h4 style={{ color: "#d5b900" }}>{action.content}</h4>;
								default:
									return <h4>Undefined</h4>;
							}
						};
						if (this.state.showStacked) {
							return (
								<div id="logcard">
									<h3>
										<span>{action.user}</span> {this.getTypeName("normal")}:
									</h3>
									<div className="content">{getEventContent()}</div>
									<p>{action.time}</p>
								</div>
							);
						} else {
							return null;
						}
					})}
				</div>
			);
		} else {
			return (
				<div id="logcard">
					<h3>
						<span>{user}</span> {this.getTypeName("normal")}:
					</h3>
					<div className="content">{this.getContent("normal")}</div>
					<p>{time}</p>
				</div>
			);
		}
	}

	getTypeName = (mode) => {
		if (mode === "stacked") {
			switch (this.props.action.type) {
				case "ban":
					return "Ban";
				case "unban":
					return "Unban";
				case "deleted":
					return "Törlés";
				case "played":
					return "Lejátszás";
				case "modify":
					return "Módosítás";
				default:
					return "";
			}
		} else if (mode === "normal") {
			switch (this.props.action.type) {
				case "ban":
					return "bannolta";
				case "unban":
					return "unbannolta";
				case "deleted":
					return "törölte";
				case "played":
					return "lejátszotta";
				case "modify":
					return "állított az oldalon";
				default:
					return "";
			}
		}
	};
	getContent = (mode) => {
		if (mode === "normal") {
			switch (this.props.action.type) {
				case "ban":
					return (
						<Link
							to={`/admin/users/#${
								JSON.parse(this.props.action.content).userid
							}`}
						>{`UserId: ${JSON.parse(this.props.action.content).userid}`}</Link>
					);
				case "unban":
					return (
						<Link
							to={`/admin/users/#${this.props.action.content}`}
						>{`UserId: ${this.props.action.content}`}</Link>
					);
				case "deleted":
					return (
						<h4 style={{ color: "#92031B" }}>{this.props.action.content}</h4>
					);
				case "played":
					return (
						<h4 style={{ color: "#139c61" }}>{this.props.action.content}</h4>
					);
				case "modify":
					return (
						<h4 style={{ color: "#d5b900" }}>{this.props.action.content}</h4>
					);
				default:
					return <h4>Undefined</h4>;
			}
		}
	};
}
