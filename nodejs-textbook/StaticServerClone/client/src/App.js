import './App.css';
import StaticUploadViewModel from './components/staticUpload/StaticUpload';

function App() {
  return (
    <div className="App">
      <StaticUploadViewModel />
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
