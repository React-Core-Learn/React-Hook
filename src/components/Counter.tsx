import { useEffect, useState } from "@/core/hooks"
import "./Counter.css"
import { useCallback } from "@/core/hooks/useCallback"

export default function Counter() {
  const [count, setCount] = useState(1)

  const handleIncrease = useCallback(() => setCount(count + 1), [count])
  const handleDecrease = useCallback(() => setCount(count - 1), [count])

  useEffect(() => {
    const setupCount = () => setCount(100)
    setupCount()
  }, [])

  return (
    <div className="count-wrapper">
      <p className="count">{count}</p>
      <button onClick={handleDecrease}>-1</button>
      <button onClick={handleIncrease}>+1</button>
    </div>
  )
}

// const handleIncrease = useCallback(() => setCount(count + 1), [])
