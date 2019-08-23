import React, { Component } from "react";
import "../css/errorpage.scss";
import { Link } from "react-router-dom";

export default class ErrorPage extends Component {
	render() {
		const { errCode } = this.props;
		return (
			<div id="error-page">
				<div className="error-page-wrapper">
					<h1>Hopsz...</h1>
					<h2>
						Ha értesz hozzá: <span>{errCode}</span>
					</h2>
					<span className="err-span" />
					{errCode === 404 ? (
						<h3>Mint ahogy időutazás sem, ilyen oldal sem létezik nálunk.</h3>
					) : (
						<h3>
							Nyugodj meg, attól megnyugszol. A hiba a mi készülékünkben van.
						</h3>
					)}
					<Link to="/">
						<button>Kezdőlap</button>
					</Link>
				</div>
			</div>
		);
	}
}
