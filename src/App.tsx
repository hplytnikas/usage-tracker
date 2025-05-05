import { useState } from 'react'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('');
  const [spendData, setSpendData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpendData = async () => {
    if (!apiKey) {
      setError('Please enter an API key');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://litellm.sph-prod.ethz.ch/key/info?key=${apiKey}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const totalSpend = data.info.spend;

      setSpendData(Number(totalSpend.toFixed(2)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>LiteLLM Spend Tracker</h1>
      
      <div className="input-container">
        <label htmlFor="apiKey">API Key:</label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
        />
        <button onClick={fetchSpendData} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Spend Data'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {spendData !== null && (
        <div className="result-container">
          <p><strong>Total Spend:</strong> {spendData}$</p>
          <p><strong>Remaining Budget:</strong> {30-spendData}$</p>
        </div>
      )}
    </div>
  )
}

export default App