import React, { Component } from "react";

import "../../css/songlist.css";

export default class SongCard extends Component {
	render() {
		const { title, artist, id } = this.props.song;

		const zIndex = {
			zIndex: id * -1
		};
		return (
			<div className="song-card" style={zIndex}>
				<h1>{artist}</h1>
				<span />
				<h1>{title}</h1>
				<h1>{this.props.isAdmin ? " asd" : ""}</h1>
			</div>
		);
	}
}
