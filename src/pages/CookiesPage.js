import React from "react";
import { Link } from "react-router-dom";

import "../css/cookiespage.css";

const CookiesPage = () => {
	return (
		<div className="cookies-page-wrapper">
			<div className="cookies-page-wrapper__content-wrapper">
				<h1>Figyelj...</h1>
				<p>
					Tudjuk hogy unalmas a <span>SÜTI (COOKIES)</span> téma, de muszáj.
				</p>
				<p>
					Az oldal használatával elfogadod azt, hogy mi az oldal működtetéséhez
					sütiket használunk. Ha nem szeretnéd ezt, kérlek hagyd el az oldalt.
				</p>
			</div>
			<Link exact="true" to="/">
				<button title="">Értem!</button>
			</Link>
		</div>
	);
};

export default CookiesPage;
