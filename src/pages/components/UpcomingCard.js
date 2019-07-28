import React, { Component } from "react";

import "../../css/songlist.css";

export default class UpcomingCard extends Component {
	render() {
		const {
			id,
			title,
			artist,
			yttitle,
			link,
			createdAt,
			played,
			playedAt
		} = this.props.song;
		return (
			<div className="upcoming-card">
				<h2>most következik:</h2>
				<h1>{artist}</h1>
				<span />
				<h1>{title}</h1>
			</div>
		);
	}
}
