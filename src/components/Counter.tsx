import { useState } from "@/core/hooks"
import "./Counter.css"

export default function Counter() {
  const [count, setCount] = useState(1)

  const handleIncrease = () => setCount(count + 1)
  const handleDecrease = () => setCount(count - 1)

  return (
    <div className="count-wrapper">
      <p className="count">{count}</p>
      <button onClick={handleDecrease}>-1</button>
      <button onClick={handleIncrease}>+1</button>
    </div>
  )
}
