import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LogCard extends Component {
	render() {
		/*
		action: {
			type: ban | unban | delete | played | modify
			name: user who committed the changes
			time: date when the change ocurred

			content
		}*/
		const { name, time } = this.props.action;
		return (
			<div id="logcard">
				<h3>
					<span>{name}</span> {this.getTypeName()}:
				</h3>
				<div className="content">{this.getContent()}</div>
				<p>{time}</p>
			</div>
		);
	}

	getTypeName = () => {
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
	};

	getContent = () => {
		switch (this.props.action.type) {
			case "ban":
				return (
					<Link
						to={`/admin/users/#${JSON.parse(this.props.action.content).userid}`}
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
	};
}
