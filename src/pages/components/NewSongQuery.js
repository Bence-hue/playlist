import React, { Component } from "react";
import { Transition, animated } from "react-spring/renderprops";
import axios from "axios";

export default class NewSongQuery extends Component {
	state = {
		active: "artist",
		flavortext: "Először add meg a szám előadóját!",
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
			this.props.fill(66);
			setTimeout(() => {
				this.setState({
					flavortext: "Most írd be a zene címét!",
					active: "title",
					toggleAnim: true
				});
			}, 400);
		} else {
			console.log(this.state.artist, this.state.title);
			let url = "";
			axios.post(url, { title: this.state.title, artist: this.state.artist });
			this.setState({ toggleAnim: false });
			this.props.fill(100);
			setTimeout(() => {
				this.setState({
					title: "",
					artist: "",
					active: "artist",
					flavortext: "Add meg1",
					toggleFinal: true
				});
			}, 1000);
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
										required
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
