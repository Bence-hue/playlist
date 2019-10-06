import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";

Sentry.init({
	dsn: "https://97dc1883092644269366ced63680323b@sentry.io/1537907"
});

// messaging.onMessage((payload) => {
// 	console.log("onMessage: ", payload);
// });

ReactDOM.render(<App />, document.getElementById("root"));

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
