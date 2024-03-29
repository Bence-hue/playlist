import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";

if(process.env.NODE_ENV !== "development") {
	Sentry.init({
		dsn: "https://97dc1883092644269366ced63680323b@sentry.io/1537907"
	});
}

ReactDOM.render(<App />, document.getElementById("root"));

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
