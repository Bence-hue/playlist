import React, { Component } from "react";
import { Transition, animated } from "react-spring/renderprops";

export default class NewSongQuery extends Component {
	state = {
		active: "artist",
		flavortext: "add meg1",
		artist: "",
		title: "",
		toggleAnim: true,
		toggleFinal: false
	};

	onChange = e => this.setState({ [e.target.name]: e.target.value });
	onSubmit = e => {
		e.preventDefault();
		if (this.state.title === "") {
			this.setState({
				toggleAnim: false
			});
			setTimeout(() => {
				this.setState({
					flavortext: "add meg2",
					active: "title",
					toggleAnim: true
				});
			}, 400);
		} else {
			console.log(this.state.artist, this.state.title);
			this.setState({ toggleAnim: false });
			setTimeout(() => {
				this.setState({
					title: "",
					artist: "",
					active: "artist",
					flavortext: "Add meg1",
					toggleFinal: true
				});
			}, 600);
		}
	};

	render() {
		return (
			<React.Fragment>
				<Transition
					native
					items={this.state.toggleAnim}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={{ duration: 200 }}
				>
					{show =>
						show &&
						(props => (
							<animated.div style={props}>
								<form className="songquery" onSubmit={this.onSubmit}>
									<h1>{this.state.flavortext}</h1>
									<input
										type="text"
										name={this.state.active}
										value={
											this.state.active === "artist"
												? this.state.artist
												: this.state.title
										}
										placeholder="Ide írd be..."
										onChange={this.onChange}
									/>
									<input type="submit" value="tovább" />
								</form>
							</animated.div>
						))
					}
				</Transition>
				<Transition
					native
					items={this.state.toggleFinal}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={{ duration: 300 }}
				>
					{show =>
						show &&
						(props => (
							<animated.div style={props}>
								<div className="final-wrapper">
									<h1>Kész!</h1>
								</div>
							</animated.div>
						))
					}
				</Transition>
			</React.Fragment>
		);
	}
}
