import React, { Component } from "react";

export default class SongCard extends Component {
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
					{id} {title} - {artist}
				</h1>
			</div>
		);
	}
}
