import React, { Component } from "react";

export default class ErrorHandler extends Component {
	state = { error: false };
	componentDidCatch(error, info) {
		this.setState({ error: true });
		console.log(error, info);
	}
	render() {
		if (this.state.error) {
			return <h1>asd</h1>;
		}
		return this.props.children;
	}
}
