import React, { Component } from "react";
import Header from "../pages/components/Header";
import axios from "axios";
import { Transition, animated } from "react-spring/renderprops";

import "../css/about.css";

export default class About extends Component {
	state = {
		fb: {
			name: "",
			email: "",
			msg: ""
		},
		charlimit: 300,
		remlength: null,
		toggleButton: true,
		toggleRes: false,
		isErr: false
	};

	UNSAFE_componentWillMount() {
		this.setState({ remlength: this.state.charlimit });
	}

	onSubmit = (e) => {
		e.preventDefault();
		let url = "/api/feedback/";
		// let content = {
		// 	name: this.state.fb.name,
		// 	email: this.state.fb.email,
		// 	message: this.state.fb.msg
		// };
		let content = new URLSearchParams();
		content.append("name", this.state.fb.name);
		content.append("email", this.state.fb.email);
		content.append("message", this.state.fb.msg);
		axios
			.post(url, content)
			.then((res) => {
				console.log(this.state.fb.name, this.state.fb.email, this.state.fb.msg);

				this.setState({ toggleButton: false, toggleRes: true });
				this.setState({ fb: { name: "", email: "", msg: "" } });
			})
			.catch((err) => {
				this.setState({ toggleButton: false, toggleRes: true, isErr: true });
				console.error(err);
			});
	};

	onChange = (e) => {
		this.setState({
			fb: { ...this.state.fb, [e.target.name]: e.target.value }
		});
	};
	onChangeTextarea = (e) => {
		this.setState({
			fb: { ...this.state.fb, [e.target.name]: e.target.value }
		});
		setTimeout(() => {
			this.setState({
				remlength: this.state.charlimit - this.state.fb.msg.length
			});
		}, 50);
	};

	render() {
		const { name, email, msg } = this.state.fb;
		const { isErr } = this.state;
		return (
			<div>
				<Header kolcsey={false} />
				<div id="about-us">
					<h1>Rólunk...</h1>
					<p>
						A Playlistet 3 Kölcsey-s diák fejleszti, annak reményében, hogy
						jobbá tegyék az iskolarádiót, és így valamennyire megkönnyítsék az
						iskolás diákok mindennapjait. Az ötlet saját, továbbá az iskolától
						semmilyen jutalmat nem kapunk a projekt fenntartásáért. Ha bármilyen
						kérdésed van, vagy bármilyen hibát tapasztalsz, nyugodtan lépj
						kapcsolatba velünk.
					</p>
					<div className="roster">
						<div className="roster__card">
							<h3>Jóvári Norbert</h3>
							<h4>Designer</h4>
						</div>
						<div className="roster__card">
							<h3>Kiss Benedek Máté</h3>
							<h4>Frontend, Designer</h4>
						</div>
						<div className="roster__card">
							<h3>Tóth Bence</h3>
							<h4>Backend</h4>
						</div>
					</div>
				</div>
				<span className="about__page-hr" />
				<div id="feedback">
					<h1>Írj nekünk...</h1>
					<form onSubmit={this.onSubmit}>
						<input
							type="text"
							name="name"
							value={name}
							placeholder="Írd ide a neved..."
							onChange={this.onChange}
							required
						/>
						<input
							type="email"
							name="email"
							value={email}
							placeholder="Írd be a Te e-mail címed..."
							onChange={this.onChange}
							required
						/>
						<div className="txt-wrapper">
							<textarea
								name="msg"
								value={msg}
								placeholder="Ide írhatod a javaslataid, észrevételeid..."
								onChange={this.onChangeTextarea}
								maxLength={this.state.charlimit}
								required
							/>
							<p className="length">
								{this.state.remlength}/{this.state.charlimit}
							</p>
						</div>
						<Transition
							native
							items={this.state.toggleButton}
							from={{ opacity: 1 }}
							enter={{ opacity: 1 }}
							leave={{ opacity: 0 }}
							config={{ duration: 200 }}
						>
							{(show) =>
								show &&
								((props) => (
									<animated.div style={props}>
										<input type="submit" value="Küldés!" />
									</animated.div>
								))
							}
						</Transition>
						<Transition
							native
							items={this.state.toggleRes}
							from={{ opacity: 0 }}
							enter={{ opacity: 1 }}
							leave={{ opacity: 0 }}
							config={{ duration: 200, delay: 300 }}
						>
							{(show) =>
								show &&
								((props) => (
									<animated.div style={props}>
										<div className={isErr ? "errcont" : "sccont"}>
											<p>
												<i
													class={
														isErr
															? "far fa-times-circle"
															: "far fa-check-circle"
													}
												/>
												{isErr ? " Hiba!" : " Siker!"}
											</p>
										</div>
									</animated.div>
								))
							}
						</Transition>
					</form>
				</div>

				<div id="jszc-modal">
					<a href="https://m.me/jelszoco" className="jszc__links">
						<i className="fab fa-facebook-messenger" /> Messenger
					</a>
					<a href="https://git.io/fj53j" className="jszc__links">
						<i className="fab fa-github" /> GitHub
					</a>
					<span className="jszc__hr" />
					<h2>Made by jelszo co.</h2>
					<a className="jszc__mail" href="mailto:support@jelszo.co">
						support@jelszo.co
					</a>
				</div>
			</div>
		);
	}
}
