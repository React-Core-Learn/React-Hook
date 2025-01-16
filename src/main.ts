// import { useState } from "./core/hooks"
import { render } from "./core/client"
import Counter from "./components/Counter"

const rootElement = document.getElementById("app")! as HTMLDivElement

render(rootElement, Counter)
