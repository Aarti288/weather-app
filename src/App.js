
import './App.css';
import TempApp from './Components/TempApp';

function App() {
  const handleOnSearchChange=(searchData)=>{
    console.log(searchData)

  }
  return (
    <div className="App">
     <TempApp onSearchChange={handleOnSearchChange}/>
    </div>
  );
}

export default App;
