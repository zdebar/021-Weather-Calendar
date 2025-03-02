import './App.css';

function App() {
  const radius = 70; 
  const numbers = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="container">
      <svg width="100%" height="100%" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet">
        <circle cx="0" cy="0" r="80" stroke="black" strokeWidth="0.5" fill="none" />

        {numbers.map((num) => {
          const angle = ((num + 6) * 15) * (Math.PI / 180); 
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <text
              key={num}
              x={x}
              y={y}
              fontSize="8"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {num}
            </text>
          );
        })}
      </svg>
    </div>
  );
}



export default App;

