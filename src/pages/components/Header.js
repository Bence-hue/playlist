import React, { Component } from "react";

import "../../css/fonts.css";
import "../../css/header.css";

import { ReactComponent as MusicPlayer } from "../../assets/music-player.svg";

export default class Header extends Component {
	render() {
		return (
			<div>
				<MusicPlayer className="menu-upleft" />
				<i class="fas fa-bars menu-upright" />
				<h1 className="playlist-title">playlist</h1>
			</div>
		);
	}
}
