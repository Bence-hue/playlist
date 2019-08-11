import React, { Component } from "react";
import Header from "../pages/components/Header";

import "../css/about.css";

export default class About extends Component {
	render() {
		return (
			<div>
				<Header kolcsey={false} />
				<div id="feedback">
					<h1>Írj nekünk...</h1>
					<form onSubmit={this.onSubmit}>
						<input
							type="text"
							name="name"
							placeholder="Írd ide a neved..."
							required
						/>
						<input
							type="text"
							name="email"
							placeholder="Írd be a Te e-mail címed..."
							required
						/>
						<textarea
							name="name"
							placeholder="Ide írhatod a javaslataid, észrevételeid..."
							maxLength="200"
							required
						/>
						<input type="submit" value="Küldés!" />
					</form>
				</div>
				<span className="about__hr" />
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
					<a href="/" className="jszc__links">
						<i className="fab fa-facebook" />
						Facebook
					</a>
					<a href="/" className="jszc__links">
						<i className="fab fa-github" />
						GitHub
					</a>
					<span className="jszc__hr" />
					<h1>Made by jelszo co.</h1>
					<a className="jszc__mail" href="mailto:support@jelszo.co">
						support@jelszo.co
					</a>
				</div>
			</div>
		);
	}
}
