import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Transition, animated } from "react-spring/renderprops";
import axios from "axios";

import { ReactComponent as ARTleft } from "../assets/Landing-left.svg";
import { ReactComponent as ARTright } from "../assets/Landing-right.svg";
import { ReactComponent as ARTbtn } from "../assets/Landing-btn-border.svg";
import { ReactComponent as MusicPlayer } from "../assets/music-player.svg";
import { ReactComponent as AddButton } from "../assets/add-button.svg";

import "../css/landing.css";
import "../css/fonts.css";

import Header from "./components/Header";
import CookiePopup from "./components/CookiePopup";

export default class Landing extends Component {
	state = {
		cookieVisible: true,
		viewCookie: true,
		latest: {
			artist: "Place",
			title: "Holder"
		}
	};
	componentWillMount() {
		const didCookie = localStorage.getItem("didCookiePresent");
		if (didCookie) {
			this.setState({ viewCookie: false });
		} else {
			this.setState({ viewCookie: true });
		}
	}

	componentDidMount() {
		let url = "http://46.107.123.236:8000/api/list/?mode=latest";
		axios.get(url).then(res => this.setState({ latest: res.data }));
	}

	hideCookie = () => {
		this.setState({ cookieVisible: false });
		localStorage.setItem("didCookiePresent", "presented");
	};
	render() {
		const viewCookie = this.state.viewCookie;
		const lat = this.state.latest;
		return (
			<React.Fragment>
				<Header kolcsey={true} />
				<div id="lastadded">
					<h3>Legutóbb hozzáadott:</h3>
					<h1>
						{lat.artist} - {lat.title}
					</h1>
				</div>
				<div id="btn-wrapper">
					<Link to="/songs">
						<div className="btn btn-left">
							<ARTbtn className="btn-border-art" />
							<h2>
								Kért
								<br />
								zenék
								<br />
								mutatása
							</h2>
							<MusicPlayer className="btn-icon" />
						</div>
					</Link>
					<Link to="/new">
						<div className="btn btn-right">
							<ARTbtn className="btn-border-art" />
							<h2>
								új
								<br />
								zenét
								<br />
								kérek!
							</h2>
							<AddButton className="btn-icon" />
						</div>
					</Link>
				</div>
				<ARTleft className="art-left" />
				<ARTright className="art-right" />

				{viewCookie ? (
					<Transition
						native
						items={this.state.cookieVisible}
						from={{ opacity: 1 }}
						enter={{ opacity: 1 }}
						leave={{ opacity: 0 }}
						config={{ duration: 400 }}
					>
						{show =>
							show &&
							(props => (
								<animated.div style={props}>
									<CookiePopup
										className="cookie-pop"
										hideCookie={this.hideCookie}
									/>
								</animated.div>
							))
						}
					</Transition>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}
