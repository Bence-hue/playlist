import React, { Component } from "react";

import Header from "../pages/components/Header";

import "../css/newsong.css";

import dash1 from "../assets/Dash-trans-1.png";
import dash2 from "../assets/Dash-trans-2.png";
import dash3 from "../assets/Dash-trans-3.png";
import dash4 from "../assets/Dash-trans-4.png";
import dash5 from "../assets/Dash-trans-5.png";

import { ReactComponent as NEWb } from "../assets/add-button.svg";
import { ReactComponent as NartLeft } from "../assets/new-song-left.svg";
import { ReactComponent as NartRight } from "../assets/new-song-right.svg";

export default class NewSong extends Component {
	render() {
		return (
			<div>
				<Header kolcsey={false} />
				<NEWb className="new-song-button" />
				<h2 className="new-song-h2">Új zenét akarok!</h2>
				<img src={dash1} alt="dash1" className="dash1" />
				<img src={dash2} alt="dash2" className="dash2" />
				<img src={dash3} alt="dash3" className="dash3" />
				<img src={dash4} alt="dash4" className="dash4" />
				<img src={dash5} alt="dash5" className="dash5" />
				<NartLeft className="new-art-left" />
				<NartRight className="new-art-right" />
			</div>
		);
	}
}
