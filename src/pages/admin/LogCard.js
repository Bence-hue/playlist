import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LogCard extends Component {
	render() {
		/*
		action: {
			type: ban | unban | delete | played | modify
			name: user who committed the changes
			time: date when the change ocurred

			userid: ban/unban id
			
			artist: deleted song artist
			title: deleted song title
			
			switch: modified property name
			state: modified property value
		}*/
		const { name, time } = this.props.action;
		return (
			<div id="logcard">
				<h2>
					<span>{name}</span> {this.getTypeName()}:
				</h2>
				<h3>{this.getContent()}</h3>
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
			case "delete":
				return "törölte";
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
						to={"/admin/users"}
					>{`UserId: ${this.props.action.userid}`}</Link>
				);
			case "unban":
				return (
					<Link
						to={"/admin/users"}
					>{`UserId: ${this.props.action.userid}`}</Link>
				);
			case "delete":
				return (
					<h2>
						{this.props.action.artist}
						<span />
						{this.props.action.title}
					</h2>
				);
			case "modify":
				return (
					<h2>
						{this.props.action.switch} <i className="fas fa-arrow-right"></i>{" "}
						{this.props.action.state}
					</h2>
				);
			default:
				return <h2>Undefined</h2>;
		}
	};
}
