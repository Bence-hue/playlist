import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Transition, animated } from "react-spring/renderprops";

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
				<MusicPlayer
					className="menu-upleft-toggle"
					onClick={this.toggleUpleft}
				/>
				<div className="menu-upright-toggle" onClick={this.toggleUpright}>
					<span className="mspan" />
					<span className="mspan" />
					<span className="mspan" />
				</div>
				<Transition
					native
					items={this.state.showUpright}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={{ duration: 300 }}
				>
					{show =>
						show &&
						(props => (
							<animated.div style={props}>
								<div id="menu-upright">
									{/* <h1>Lore text</h1> */}
									<Link exact to="/admin">
										<i class="fas fa-lock" />
									</Link>
									<Link exact to="/cookies">
										<i class="fas fa-fingerprint" />
									</Link>
									<Link exact to="/about">
										<i class="fas fa-file-invoice" />
									</Link>
								</div>
							</animated.div>
						))
					}
				</Transition>
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
