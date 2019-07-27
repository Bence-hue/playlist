import React, { Component } from "react";

import "../../css/fonts.css";
import "../../css/header.css";

import { ReactComponent as MusicPlayer } from "../../assets/music-player.svg";

export default class Header extends Component {
	render() {
		const kolcsey = this.props.kolcsey;
		return (
			<div>
				<MusicPlayer className="menu-upleft" />
				<div className="menu-upright" onClick="">
					<span className="mspan" />
					<span className="mspan" />
					<span className="mspan" />
				</div>
				<div className="playlist">
					<h1 className="playlist-title">playlist</h1>
					<h3 className="playlist-lore">
						{kolcsey ? "kölcsey ferenc gimnázium" : ""}
					</h3>
				</div>
			</div>
		);
	}
}
