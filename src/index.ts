import errorHandler from "errorhandler"; 
import app from "./app";

var server = require('http').Server(app);
server.listen(app.get("port"), () => {
    console.log(app.get("port"), " teting");
 
    console.log(
        "App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});
app.use(errorHandler());

export default server;
