import React, { Component } from "react";

import "../../css/admin-css/settings.scss";

export default class Toggler extends Component {
	render() {
		let styleToggler, styleCircle;
		if (this.props.state) {
			styleToggler = { background: "#139c61" };
			styleCircle = { left: "100%", transform: "translateX(-100%)" };
		} else {
			styleToggler = { background: "#eeeeee" };
			styleCircle = { left: "0" };
		}
		return (
			<div id="toggler" onClick={this.props.toggle} style={styleToggler}>
				<span id="toggler-circle" style={styleCircle}></span>
			</div>
		);
	}
}
