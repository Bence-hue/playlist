import React, { Component } from "react";
//import PropTypes from "prop-types";

import "../css/landing.css";
import "../css/fonts.css";

import Header from "./components/Header";

export default class Landing extends Component {
	render() {
		return (
			<div>
				<Header />
				<h1>Hello World</h1>
			</div>
		);
	}
}
