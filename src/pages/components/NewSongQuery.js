import React, { Component } from "react";
import { Transition, animated } from "react-spring/renderprops";
import axios from "axios";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/messaging";
import Modal from "./Modal";

import { ReactComponent as ExCircle } from "../../assets/circle-notch-solid.svg";
import { ReactComponent as ExMark } from "../../assets/exclamation-solid.svg";
import { ReactComponent as CheckCircle } from "../../assets/check-circle-regular.svg";

export default class NewSongQuery extends Component {
	state = {
		csrfToken: "",
		active: "artist",
		flavortext: "Először add meg a szám",
		flavorspan: "előadóját",
		artist: "",
		title: "",
		toggleAnim: true,
		toggleFinal: false,
		toggleNotiRequest: false,
		allowNotiRequest: true,
		toggleErr: false,
		err: {
			title: "",
			flavor: "",
			remTime: ""
		}
	};

	componentWillMount() {
		this.setState({ csrfToken: cookie.load("csrftoken") });
	}

	componentDidMount() {
		const firebaseConfig = {
			apiKey: "AIzaSyCSnUYWR95Go_re_d6ClkK0AXgCXJJ5gNI",
			authDomain: "playlist-248218.firebaseapp.com",
			databaseURL: "https://playlist-248218.firebaseio.com",
			projectId: "playlist-248218",
			storageBucket: "",
			messagingSenderId: "687275559983",
			appId: "1:687275559983:web:12a27164caeadf2c3f8ada",
			measurementId: "G-HZRTRM0P1J"
		};
		firebase.initializeApp(firebaseConfig);
		const messaging = firebase.messaging();
		messaging.usePublicVapidKey(
			"BEumBgeaNS-cDLgwwjnUqKfKJs9l10mDn1-99N9RXY-0LaWGUA3I5vB_80k6jKWp2A61NzeM4siW6e1kF3uyzjc"
		);
		console.log("getToken result:" + messaging.getToken());

		if (messaging.getToken() === null) {
			this.setState({ allowNotiRequest: true });
		} else {
			this.setState({ allowNotiRequest: false });
		}
		this.promptNoti = () => {
			console.log("function running");
			messaging
				.requestPermission()
				.then(() => {
					console.log("Perm granted");
					return messaging.getToken();
				})
				.then((token) => {
					let url = "/api/setFcmToken/",
						params = new URLSearchParams();
					params.append("token", token);
					axios.defaults.xsrfCookieName = "csrftoken";
					axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
					axios
						.post(url, params)
						.then((res) => {
							console.log("Token set");
							this.setState({ toggleNotiRequest: false });
						})
						.catch((err) => {
							console.error(err);
							alert("API Hiba!");
							window.location.href = "/";
						});
				})
				.catch((err) => {
					if (!(err.name === "FirebaseError")) {
						alert("Hiba!");
						window.location.href = "/";
					}
					console.error(err);
				});
		};
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value });
	onSubmit = (e) => {
		e.preventDefault();
		let patt = /\S/;
		if (this.state.title === "") {
			if (patt.test(this.state.artist)) {
				this.setState({
					toggleAnim: false
				});
				this.props.fill(66);
				setTimeout(() => {
					this.setState({
						flavortext: "Most írd be a zene",
						flavorspan: "címét",
						active: "title",
						toggleAnim: true
					});
				}, 400);
			} else {
				alert("Ilyet nem játszunk.");
			}
		} else {
			if (patt.test(this.state.title)) {
				const url = "/api/new/";
				const params = new URLSearchParams();
				params.append("title", this.state.title);
				params.append("artist", this.state.artist);
				params.append("token", "ffhPRx4Aql5G7jOCNxZDw6ZjMnD4BdWR");
				axios.defaults.xsrfCookieName = "csrftoken";
				axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
				axios
					.post(url, params)
					.then((res) => {
						this.setState({ toggleAnim: false });
						this.props.fill(100);
						setTimeout(() => {
							this.setState({
								title: "",
								artist: "",
								active: "artist",
								flavortext: "",
								toggleFinal: true,
								toggleErr: false
							});
							if (this.state.allowNotiRequest === true) {
								this.setState({ toggleNotiRequest: true });
							}
						}, 1000);
					})
					.catch((err) => {
						if (err.response) {
							/*
							 * The request was made and the server responded with a
							 * status code that falls out of the range of 2xx
							 */
							switch (err.response.status) {
								case 422:
									// Duplicate
									this.setState({
										err: {
											title: "Hupsz..",
											flavor: "Ez a szám már hozzá lett adva."
										},
										toggleAnim: false,
										toggleErr: true
									});
									break;
								case 403:
									// CSRF error
									this.setState({
										err: {
											title: "Hupsz..",
											flavor:
												"Valami nem stimmel az azonosítóddal. Ha többször látod ezt a hibát, kérlek vedd fel velünk a kapcsolatot."
										},
										toggleAnim: false,
										toggleErr: true
									});
									break;
								case 429:
									// Time limit
									this.setState({
										err: {
											title: "Woah lassíts!",
											flavor: `Elérted a kérési limitet. Legközelebb ${err.response.data} múlva kérhetsz újra.`
										},
										toggleAnim: false,
										toggleErr: true
									});
									break;
								case 418:
									// Permaban

									this.setState({
										err: {
											title: "Ejnye...",
											flavor:
												"Valamit nagyon elszúrhattál. Sajnos te már nem kérhetsz nálunk zenét."
										},
										toggleAnim: false,
										toggleErr: true
									});
									break;
								case 401:
									// Timeout
									this.setState({
										err: {
											title: "Ejnye...",
											flavor: `Valamit nagyon elszúrhattál, ugyanis még ${err.response.data} el vagy tiltva a zenekéréstől.`
										},
										toggleAnim: false,
										toggleErr: true
									});
									break;
								default:
									// Server error
									this.setState({
										err: {
											title: "Szerverhiba!",
											flavor:
												"Ezt elrontottunk. Valami nem stimmel nálunk. Próbáld újra!"
										},
										toggleAnim: false,
										toggleErr: true
									});
							}
						} else if (err.request) {
							/* The request was made but no response was received */
						}

						this.props.dashRed();
						this.props.fill(100);
					});
			} else {
				alert("Ilyet nem játszunk.");
			}
		}
	};

	render() {
		return (
			<React.Fragment>
				<Modal
					toggler={this.state.toggleNotiRequest}
					title={"Értesítések"}
					content={
						"Ha szeretnél értesítést kapni, amikor a te zenédet játsszuk, kérlek fogadd el a következő felugró ablakban az értesítéseket."
					}
					buttonText={"OK"}
					onButtonClick={() => {
						this.promptNoti();
					}}
				/>
				<Transition
					native
					items={this.state.toggleAnim}
					from={{ opacity: 0 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0 }}
					config={{ duration: 200 }}
				>
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<form
									className='songquery'
									onSubmit={this.onSubmit}
									autoComplete='off'
									title=''
								>
									<h1>
										{this.state.flavortext} <span>{this.state.flavorspan}</span>
										!
									</h1>
									<input
										autoFocus
										required
										type='text'
										name={this.state.active}
										value={
											this.state.active === "artist"
												? this.state.artist
												: this.state.title
										}
										placeholder='Ide írd be...'
										onChange={this.onChange}
									/>
									<input type='submit' value='tovább' />
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
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<div className='final-wrapper'>
									<CheckCircle className='final-svg' />
									<h1>Kész!</h1>
									<Link to='/'>
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
					{(show) =>
						show &&
						((props) => (
							<animated.div style={props}>
								<div className='error-wrapper'>
									<ExCircle className='err-svg' />
									<ExMark className='err-svg' />
									<h1>{this.state.err.title}</h1>
									<p>{this.state.err.flavor}</p>
									<Link to='/'>
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
