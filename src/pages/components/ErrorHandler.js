import React, { Component } from "react";
import "../../css/errorhandler.css";

export default class ErrorHandler extends Component {
	state = { error: false };
	componentDidCatch(error, info) {
		this.setState({ error: true });
		console.log(error, info);
	}
	render() {
		if (this.state.error) {
			return (
				<div id="error-handler">
					<h1>
						<span>React</span> error
					</h1>
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
