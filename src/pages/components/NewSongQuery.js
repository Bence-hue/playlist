import React, { Component } from "react";
import { Transition, animated } from "react-spring/renderprops";
import axios from "axios";
import cookie from "react-cookies";
import { Link } from "react-router-dom";

import { ReactComponent as ExCircle } from "../../assets/circle-notch-solid.svg";
import { ReactComponent as ExMark } from "../../assets/exclamation-solid.svg";
import { ReactComponent as CheckCircle } from "../../assets/check-circle-regular.svg";

export default class NewSongQuery extends Component {
	state = {
		csrfToken: "",
		active: "artist",
		flavortext: "Először add meg a szám előadóját!",
		artist: "",
		title: "",
		toggleAnim: true,
		toggleFinal: false,
		toggleErr: false,
		err: {
			code: "",
			title: "",
			flavor: "",
			remTime: ""
		}
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
			const url = "/api/new/";
			const params = new URLSearchParams();
			params.append("title", this.state.title);
			params.append("artist", this.state.artist);
			params.append("token", "ffhPRx4Aql5G7jOCNxZDw6ZjMnD4BdWR");
			axios.defaults.xsrfCookieName = "csrftoken";
			axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
			axios
				.post(url, params)
				.then(res => {
					this.setState({ toggleAnim: false });
					this.props.fill(100);
					setTimeout(() => {
						this.setState({
							title: "",
							artist: "",
							active: "artist",
							flavortext: "",
							toggleFinal: true
						});
					}, 1000);
				})
				.catch(err => {
					if (err.response) {
						/*
						 * The request was made and the server responded with a
						 * status code that falls out of the range of 2xx
						 */
						console.log(err.response.data);
						console.log(err.response.status);
						if (err.response.status === 422) {
							this.setState({
								err: {
									code: 422,
									title: "Hupsz..",
									flavor: "Ez a szám már hozzá lett adva."
								},
								toggleAnim: false,
								toggleErr: true
							});
							this.props.dashRed();
							this.props.fill(100);
						} else if (err.response.status === 403) {
							this.setState({
								err: {
									code: 403,
									title: "Hupsz..",
									flavor:
										"Valami nem stimmel az azonosítóddal. Ugye nem vagy hacker?"
								},
								toggleAnim: false,
								toggleErr: true
							});
							this.props.dashRed();
							this.props.fill(100);
						} else if (err.response.status === 429) {
							this.setState({
								err: {
									code: 429,
									title: "Woah lassíts!",
									flavor: `Elérted a kérési limitet. Legközelebb ${
										err.response.status
									} múlva kérhetsz újra.`
								},
								toggleAnim: false,
								toggleErr: true
							});
							this.props.dashRed();
							this.props.fill(100);
						} else {
							this.setState({
								err: {
									title: "Szerverhiba!",
									flavor:
										"Ezt elrontottunk. Valami nem stimmel nálunk. Próbáld újra!"
								},
								toggleAnim: false,
								toggleErr: true
							});
							this.props.dashRed();
							this.props.fill(100);
						}
					} else if (err.request) {
						/* The request was made but no response was received */
						console.log(err.request);
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
								<form
									className="songquery"
									onSubmit={this.onSubmit}
									autoComplete="off"
									title=""
								>
									<h1>{this.state.flavortext}</h1>
									<input
										autoFocus
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
									<CheckCircle className="final-svg" />
									<h1>Kész!</h1>
									<Link to="/">
										<button>kezdőlap</button>
									</Link>
								</div>
							</animated.div>
						))
					}
				</Transition>
				<Transition
					native
					items={this.state.toggleErr}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={{ duration: 400, delay: 400 }}
				>
					{show =>
						show &&
						(props => (
							<animated.div style={props}>
								<div className="error-wrapper">
									<ExCircle className="err-svg" />
									<ExMark className="err-svg" />
									<h1>{this.state.err.title}</h1>
									<p>{this.state.err.flavor}</p>
									<Link to="/">
										<button>kezdőlap</button>
									</Link>
								</div>
							</animated.div>
						))
					}
				</Transition>
			</React.Fragment>
		);
	}
}
