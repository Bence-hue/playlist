import React, { Component } from "react";
import Header from "../pages/components/Header";

export default class About extends Component {
	render() {
		return (
			<div>
				<Header kolcsey={false} />
				<div className="feedback">
					<h1>Írj nekünk...</h1>
					<form>
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
							maxlength="200"
							rows="10"
							cols="20"
							required
						/>
						<input type="submit" value="Küldés!" />
					</form>
				</div>
				<div className="about-us">
					<h1>About us</h1>
				</div>
				<div className="jszc-modal">
					<a href="/" className="jszc__links">
						Facebook
					</a>
					<a href="/" className="jszc__links">
						GitHub
					</a>
					<span className="jszc__hr" />
					<h1>Made by jelszo co.</h1>
					<a class="jszc__mail" href="mailto:support@jelszo.co">
						support@jelszo.co
					</a>
				</div>
			</div>
		);
	}
}
