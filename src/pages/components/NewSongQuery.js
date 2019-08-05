import React, { Component } from "react";
import { Transition, animated } from "react-spring/renderprops";
import axios from "axios";
import cookie from "react-cookies";

export default class NewSongQuery extends Component {
	state = {
		csrfToken: "",
		active: "artist",
		flavortext: "Először add meg a szám előadóját!",
		artist: "",
		title: "",
		toggleAnim: true,
		toggleFinal: false
	};

	componentWillMount() {
		this.setState({ csrfToken: cookie.load("csrftoken") });
	}

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
			let url = "https://playlist.jelszo.co/api/new/";
			let data = {
				title: this.state.title,
				artist: this.state.artist,
				"X-CSRFToken": this.state.csrfToken
			};
			axios
				.post(url, data)
				.then(res => {
					this.setState({ toggleAnim: false });
					this.props.fill(100);
					setTimeout(() => {
						this.setState({
							title: "",
							artist: "",
							active: "artist",
							flavortext: "Add meg1",
							toggleFinal: true,
							errServer: false,
							errTime: false
						});
					}, 1000);
				})
				.catch(err => {
					if (err.response) {
						/*
						 * The request was made and the server responded with a
						 * status code that falls out of the range of 2xx
						 */
						if (err.response.status === 422) {
							this.setState({ errTime: true });
						} else {
							this.setState({ errServer: true });
						}
					} else if (err.request) {
						/*
						 * The request was made but no response was received, `error.request`
						 * is an instance of XMLHttpRequest in the browser and an instance
						 * of http.ClientRequest in Node.js
						 */
						console.log(err.request);
					} else {
						// Something happened in setting up the request and triggered an Error
						console.log("Error", err.message);
					}
				});
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
