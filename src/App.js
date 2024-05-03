import axios from 'axios'; 
import { useEffect, useState } from 'react';


function App() {
 
  const [address,setAddress] = useState('');
  const [data, setData] = useState('');
  const [search, setSearch] = useState('');

  function getDate() {
    const today = new Date();
    const dateString = today.toDateString();
    const parts = dateString.split(' ');
    const day = parts[0];
    const month = parts[1];
    return `${day} | ${month}`;
  }

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearch(input);
  }

  function weatherDetails(lon, lat){
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
    axios.get(weatherUrl)
      .then(response => {
        setData(response.data.current);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }

  async function general(){

    try {
      if(search ===''){
        navigator.geolocation.getCurrentPosition(pos => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;
          weatherDetails(long, lat);

          // Fetch address
          const addressUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
          fetch(addressUrl)
            .then(res => res.json())
            .then(data => setAddress(data.address.province.toUpperCase()))
            .catch(error => console.error('Error fetching address:', error));

          // Fetch weather data
          
        });
    
    }else{
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0]; 

            weatherDetails(lon , lat);

           setAddress(search.toUpperCase());

          } else {
            console.log('City not found');
          }
        } catch (error) {
          console.error('Error fetching city coordinates:', error);
        }
      };
    
    

    }

     catch (error) {
      console.error('Error:', error);
    }
    }

    console.log(address);


  useEffect(() => {
    general();
   }, []);

   
    return (
      <div>
        <div className="main">
          <div className='search'>
            <input type="text" placeholder='search' value={search} onChange={handleSearchChange}/>       
            <button onClick={general}><img src='images/search.png'></img></button>   
          </div>
          <div className="location">
            <p>{address}</p>
          </div>
          <div className="temperature">
          <img src='/images/output-onlinegiftools.gif' />
            <p>{data.temperature_2m}</p>
          </div>
          <div className='wind'>
            <img src='/images/output-onlinegiftools (1).gif'/>
            <p>{data.wind_speed_10m}</p>
          </div>
          <div className="date">{getDate()}</div>

        </div>
      </div>
    );
  }
   


  

export default App;
