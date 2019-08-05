import React, { Component } from "react";

export default class ErrorHandler extends Component {
	state = { error: false };
	componentDidCatch(error, info) {
		this.setState({ error: true });
		console.log(error, info);
	}
	render() {
		const errStyle = { position: "absolute" };
		if (this.state.error) {
			return (
				<div id="error-handler" style={errStyle}>
					<h1>React error</h1>
					<p>Hopsz.. A React hibába ütközött.</p>
					<p>
						További infóért nézd meg a konzolt.{" "}
						<span className="psst">
							(f12
							<span role="img" aria-label="Winking face">
								😉
							</span>
							)
						</span>
					</p>
				</div>
			);
		}
		return this.props.children;
	}
}
