import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Transition, animated } from "react-spring/renderprops";

import "../../css/fonts.css";
import "../../css/header.css";
import "../../css/hover.css";

import { ReactComponent as MusicPlayer } from "../../assets/music-player.svg";
import { ReactComponent as Lock } from "../../assets/lock-solid.svg";
import { ReactComponent as Fingerprint } from "../../assets/fingerprint-solid.svg";
import { ReactComponent as Inv } from "../../assets/file-invoice-solid.svg";

export default class Header extends Component {
	state = {
		showUpright: false,
		showUpleft: false,
		UprightText: ""
	};

	componentWillMount() {
		document.addEventListener("mousedown", this.handleClick, false);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClick, false);
	}

	handleClick = e => {
		if (this.node.contains(e.target)) {
			//asd
			return;
		}
		this.setState({ showUpright: false });
	};

	// MENU TOGGLERS
	toggleUpright = e => {
		this.setState({ showUpright: !this.state.showUpright });
	};

	toggleUpleft = e => {
		this.setState({ showUpleft: !this.state.showUpleft });
	};
	// LEFT BUTTONS
	LOCK_onMouseHover = e => {
		console.log(`LOCK - HOVERED`);
		this.setState({ UprightText: "Admin belépés" });
	};
	LOCK_onMouseHoverStop = e => {
		console.log("LOCK - Stopped");
		this.setState({ UprightText: "" });
	};

	FINGER_onMouseHover = e => {
		console.log(`FINGER - HOVERED`);
		this.setState({ UprightText: "Sütik használata" });
	};
	FINGER_onMouseHoverStop = e => {
		console.log("FINGER - Stopped");
		this.setState({ UprightText: "" });
	};

	INV_onMouseHover = e => {
		console.log(`INV - HOVERED`);
		this.setState({ UprightText: "Rólunk" });
	};
	INV_onMouseHoverStop = e => {
		console.log("INV - Stopped");
		this.setState({ UprightText: "" });
	};

	render() {
		const kolcsey = this.props.kolcsey;
		return (
			<div ref={node => (this.node = node)}>
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
									<h3 className="upright-text">{this.state.UprightText}</h3>
									<Link exact="true" to="/admin">
										<Lock className="MU-icons lock hvr-grow" />
										{/* <i
											className="fas fa-lock hvr-grow"
											onMouseEnter={this.LOCK_onMouseHover.bind(this)}
											onMouseLeave={this.LOCK_onMouseHoverStop.bind(this)}
										/> */}
									</Link>
									<Link exact="true" to="/cookies">
										<Fingerprint className="MU-icons finger hvr-grow" />
										{/* <i
											className="fas fa-fingerprint hvr-grow"
											onMouseEnter={this.FINGER_onMouseHover.bind(this)}
											onMouseLeave={this.FINGER_onMouseHoverStop.bind(this)}
										/> */}
									</Link>
									<Link exact="true" to="/about">
										<Inv className="MU-icons inv hvr-grow" />
										{/* <i
											className="fas fa-file-invoice hvr-grow"
											onMouseEnter={this.INV_onMouseHover.bind(this)}
											onMouseLeave={this.INV_onMouseHoverStop.bind(this)}
										/> */}
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
