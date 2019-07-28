import React, { Component } from "react";

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
			<div>
				<h1>
					Upcoming: {id} {title} - {artist}
				</h1>
			</div>
		);
	}
}
