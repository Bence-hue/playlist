import React, { Component } from "react";
import { Link } from "react-router-dom";

//import PropTypes from "prop-types";

import { ReactComponent as ARTleft } from "../assets/Landing-left.svg";
import { ReactComponent as ARTright } from "../assets/Landing-right.svg";
import { ReactComponent as ARTbtn } from "../assets/Landing-btn-border.svg";
import { ReactComponent as MusicPlayer } from "../assets/music-player.svg";
import { ReactComponent as AddButton } from "../assets/add-button.svg";

import "../css/landing.css";
import "../css/fonts.css";

import Header from "./components/Header";

export default class Landing extends Component {
	render() {
		return (
			<React.Fragment>
				<Header kolcsey={true} />
				<div id="lastadded">
					<h3>Legutóbb hozzáadott:</h3>
					<h1>placeholder - original mix</h1>
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
			</React.Fragment>
		);
	}
}
