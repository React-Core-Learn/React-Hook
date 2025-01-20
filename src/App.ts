// import { useState } from "./core/hooks"
import { render } from "./core/client"
import Main from "./pages/main"

const rootElement = document.getElementById("app")! as HTMLDivElement

render(rootElement, Main)
