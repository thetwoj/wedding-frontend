import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { unregister} from "./registerServiceWorker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const WrapApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<WrapApp />, document.getElementById("root"));
unregister();
