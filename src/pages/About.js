import React, { Component } from "react";
import Header from "../pages/components/Header";
import axios from "axios";

import "../css/about.css";

export default class About extends Component {
	state = {
		fb: {
			name: "",
			email: "",
			msg: ""
		},
		toggleSuccess: false,
		toggleErr: false
	};

	onSubmit = e => {
		e.preventDefault();
		let url = "";
		let content = {
			name: this.state.fb.name,
			email: this.state.fb.email,
			message: this.state.fb.msg
		};
		axios
			.post(url, content)
			.then(res => {
				this.setState({ toggleSuccess: true });
				this.setState({ fb: { name: "", email: "", msg: "" } });
			})
			.catch(err => {
				this.setState({ toggleErr: true });
				console.log(err);
			});
		console.log(this.state.fb);
	};

	onChange = e => {
		this.setState({
			fb: { ...this.state.fb, [e.target.name]: e.target.value }
		});
	};

	render() {
		const { name, email, msg } = this.state.fb;
		return (
			<div>
				<Header kolcsey={false} />
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
						<textarea
							name="msg"
							value={msg}
							placeholder="Ide írhatod a javaslataid, észrevételeid..."
							onChange={this.onChange}
							maxLength="300"
							required
						/>
						<input type="submit" value="Küldés!" />
					</form>
				</div>
				<span className="about__page-hr" />
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
				<div id="jszc-modal">
					<a href="https://fb.me/jelszoco" className="jszc__links">
						<i className="fab fa-facebook" /> Facebook
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
