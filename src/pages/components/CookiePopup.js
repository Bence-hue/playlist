import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";

import "../../css/cookie.css";
import "../../css/hover.css";

export default class CookiePopup extends Component {
	render() {
		const hideCookie = this.props.hideCookie;
		return (
			<Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ delay: 500 }}>
				{props => (
					<div style={props}>
						<div className="cookie-popup-back">
							<div className="cookie-popup">
								<div className="cookie-wrapper">
									<h1>
										<span>Süti beállítások. - </span>Unalmas. Fárasztó. De
										kötelező.
									</h1>
									<p>
										Az oldal használatával elfogadod azt, hogy mi az oldal
										üzemeltetéséhez Sütiket (cookie-kat) használunk.
									</p>
									<button onClick={hideCookie} className="hvr-grow">
										Értem!
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</Spring>
		);
	}
}
