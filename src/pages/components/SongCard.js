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
			<div className="song-card">
				<h1>
					{id} {title} - {artist}
					{this.props.isAdmin ? " asd" : ""}
				</h1>
			</div>
		);
	}
}
