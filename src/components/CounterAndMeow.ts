import MyReact from '../core/MyReact';

const { useState, render } = MyReact();

export default function CounterAndMeow() {
  const [count, setCount] = useState(1);
  const [cat, setCat] = useState('야옹!');

  function countMeow(newCount: number) {
    setCount(newCount);
    setCat('야옹! '.repeat(newCount));
  }

  window.increment = () => countMeow(count + 1);
  window.decrement = () => {
    if (count > 0) countMeow(count - 1);
  };

  return `
  <div>
    <p>고양이가 ${count}번 울어서 ${cat} </p>
    <button onclick="increment()">증가</button>
    <button onclick="decrement()">감소</button>
  </div>
  `;
}
