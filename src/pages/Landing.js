import React, { Component } from "react";
//import PropTypes from "prop-types";

import "../css/landing.css";
import "../css/fonts.css";

import Header from "./components/Header";

export default class Landing extends Component {
	render() {
		return (
			<div>
				<Header kolcsey={true} />
				<div id="lastadded">
					<h3>Legutóbb hozzáadott:</h3>
					<h1>placeholder - original mix</h1>
				</div>
			</div>
		);
	}
}
