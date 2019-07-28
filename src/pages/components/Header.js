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
		UprightText: "",
		isUprightIconsVisible: false
	};

	componentWillMount() {
		document.addEventListener("mousedown", this.handleClick, false);
	}
	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClick, false);
	}
	// CLOSE MENU ON OUTER CLICK
	handleClick = e => {
		if (this.node.contains(e.target)) {
			//asd
			return;
		}
		this.setState({ showUpright: false, showUpleft: false });
	};

	// MENU TOGGLERS
	toggleUpright = e => {
		this.setState({
			showUpright: !this.state.showUpright,
			isUprightIconsVisible: true,
			isUprightTextVisible: false
		});
	};

	toggleUpleft = e => {
		this.setState({ showUpleft: !this.state.showUpleft });
	};

	// LEFT BUTTONS HOVER CONTROLLERS
	LOCK_onMouseHover = e => {
		this.setState({ UprightText: "Admin belépés", isUprightTextVisible: true });
		document.getElementById("SPANlock").style.opacity = 1;
	};
	LOCK_onMouseHoverStop = e => {
		this.setState({ UprightText: "", isUprightTextVisible: false });
		document.getElementById("SPANlock").style.opacity = 0;
	};
	FINGER_onMouseHover = e => {
		this.setState({ UprightText: "Sütik", isUprightTextVisible: true });
		document.getElementById("SPANfinger").style.opacity = 1;
	};
	FINGER_onMouseHoverStop = e => {
		this.setState({ UprightText: "", isUprightTextVisible: false });
		document.getElementById("SPANfinger").style.opacity = 0;
	};
	INV_onMouseHover = e => {
		this.setState({ UprightText: "Rólunk", isUprightTextVisible: true });
		document.getElementById("SPANinv").style.opacity = 1;
	};
	INV_onMouseHoverStop = e => {
		this.setState({ UprightText: "", isUprightTextVisible: false });
		document.getElementById("SPANinv").style.opacity = 0;
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
					<span />
					<span />
					<span />
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
									<Transition
										native
										items={this.state.isUprightTextVisible}
										from={{ opacity: 0 }}
										enter={{ opacity: 1 }}
										leave={{ opacity: 0 }}
										config={{ duration: 200 }}
									>
										{show =>
											show &&
											(props => (
												<animated.div style={props}>
													<h3 className="upright-text">
														{this.state.UprightText}
													</h3>
												</animated.div>
											))
										}
									</Transition>

									<Transition
										native
										items={this.state.isUprightIconsVisible}
										from={{ opacity: 0 }}
										enter={{ opacity: 1 }}
										leave={{ opacity: 0 }}
										config={{ duration: 400, delay: 200 }}
									>
										{show =>
											show &&
											(props => (
												<animated.div style={props}>
													<Link exact="true" to="/admin">
														<Lock
															className="MU-icons lock hvr-grow"
															onMouseEnter={this.LOCK_onMouseHover.bind(this)}
															onMouseLeave={this.LOCK_onMouseHoverStop.bind(
																this
															)}
														/>
													</Link>
												</animated.div>
											))
										}
									</Transition>
									<span id="SPANlock" />
									<Transition
										native
										items={this.state.isUprightIconsVisible}
										from={{ opacity: 0 }}
										enter={{ opacity: 1 }}
										leave={{ opacity: 0 }}
										config={{ duration: 400, delay: 400 }}
									>
										{show =>
											show &&
											(props => (
												<animated.div style={props}>
													<Link exact="true" to="/cookies">
														<Fingerprint
															className="MU-icons finger hvr-grow"
															onMouseEnter={this.FINGER_onMouseHover.bind(this)}
															onMouseLeave={this.FINGER_onMouseHoverStop.bind(
																this
															)}
														/>
													</Link>
												</animated.div>
											))
										}
									</Transition>
									<span id="SPANfinger" />
									<Transition
										native
										items={this.state.isUprightIconsVisible}
										from={{ opacity: 0 }}
										enter={{ opacity: 1 }}
										leave={{ opacity: 0 }}
										config={{ duration: 400, delay: 600 }}
									>
										{show =>
											show &&
											(props => (
												<animated.div style={props}>
													<Link exact="true" to="/about">
														<Inv
															className="MU-icons inv hvr-grow"
															onMouseEnter={this.INV_onMouseHover.bind(this)}
															onMouseLeave={this.INV_onMouseHoverStop.bind(
																this
															)}
														/>
													</Link>
												</animated.div>
											))
										}
									</Transition>
									<span id="SPANinv" />
								</div>
							</animated.div>
						))
					}
				</Transition>
				<div className="playlist">
					<Link exact="true" to="/" style={{ textDecoration: "none" }}>
						<h1 className="playlist-title">playlist</h1>
					</Link>
					<h3 className="playlist-lore">
						{kolcsey ? "kölcsey ferenc gimnázium" : ""}
					</h3>
				</div>
			</div>
		);
	}
}
