import React, { Component } from "react";

import "../../css/cookie.css";

export default class CookiePopup extends Component {
	render() {
		const hideCookie = this.props.hideCookie;
		return (
			<div className="cookie-popup-back">
				<div className="cookie-popup">
					<div className="cookie-wrapper">
						<h1>
							<span>Süti beállítások. - </span>Unalmas. Fárasztó. De kötelező.
						</h1>
						<p>
							Az oldal használatával elfogadod azt, hogy mi az oldal
							üzemeltetéséhez Sütiket (cookie-kat) használunk.
						</p>
						<button onClick={hideCookie}>Értem!</button>
					</div>
				</div>
			</div>
		);
	}
}
