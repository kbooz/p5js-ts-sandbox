import "p5";
import App from "./app";
import "./index.css"
import searchParams from "./utils/uri";

const projectName = searchParams.get("project")
const app = new App(projectName)

await app.start(projectName)
