import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format dates from Unix timestamps
const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString(); // Format as YYYY-MM-DD
};

const Home = () => {
  const [ticker, setTicker] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pivotalPoints, setPivotalPoints] = useState([]);

  const fetchStockData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const timestamp = new Date().getTime(); // Unique query parameter to bypass cache
      const response = await axios.get(`/api/stocks?ticker=${ticker}&_=${timestamp}`);
      const data = response.data;

      console.log('Fetched data:', data); // Debugging: Log the raw data

      if (data && data.Close) {
        // Convert integer timestamps to date strings
        const labels = Object.keys(data.Close).map(date => formatDate(date));
        const prices = Object.values(data.Close);

        console.log('Labels:', labels); // Debugging: Log the formatted labels
        console.log('Prices:', prices); // Debugging: Log the prices

        setChartData({
          labels,
          datasets: [
            {
              label: `${ticker} Stock Price`,
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        });

        // Call the API route to run MATLAB analysis
        await axios.get('/api/runMatlab');
        
        // Fetch pivotal points after MATLAB script execution
        const pivotalResponse = await axios.get('/public/pivotal_points.csv');
        const pivotalText = await pivotalResponse.data;
        const pivotalRows = pivotalText.split('\n').slice(1); // Skip header
        const points = pivotalRows.map(row => {
          const [date, price] = row.split(',');
          return { date, price: parseFloat(price) };
        });
        setPivotalPoints(points);
      } else {
        setError('Invalid data format');
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      setError('Error fetching stock data');
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={fetchStockData}>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter stock ticker"
        />
        <button type="submit">Fetch Stock Data</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {chartData ? (
        <div>
          <Line data={chartData} />
        </div>
      ) : (
        !loading && <p>No data available</p>
      )}
      <div>
        <h2>Pivotal Points</h2>
        <ul>
          {pivotalPoints.map((point, index) => (
            <li key={index}>
              Date: {point.date}, Price: ${point.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
