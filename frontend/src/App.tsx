import './App.css';
import { getWeather } from './utils/fetchAPI';
import { useEffect } from 'react';


function App() {


  useEffect(() => {
    getWeather()
      .then((res) => {
        console.log(res);
      })
      .catch();
  }, []);

  return (
    <div className='app'>
      <div className="row">first row </div>
      <div className="row">second row   </div>
    </div>
  );
}

export default App;
