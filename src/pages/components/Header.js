import React, { Component } from "react";

import "../../css/fonts.css";
import "../../css/header.css";

import { ReactComponent as MusicPlayer } from "../../assets/music-player.svg";

export default class Header extends Component {
	state = {
		showUpright: false,
		showUpleft: false
	};

	toggleUpright = e => {
		this.setState({ showUpright: !this.state.showUpright });
	};

	toggleUpleft = e => {
		this.setState({ showUpleft: !this.state.showUpleft });
	};

	render() {
		const kolcsey = this.props.kolcsey;
		return (
			<div>
				<MusicPlayer className="menu-upleft" onClick={this.toggleUpleft} />
				<div className="menu-upright" onClick={this.toggleUpright}>
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
