import './App.css'
import Calculator from './components/Calculator';


function App() {
  return <>
    <div className="mb-3">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Home Loan Calculator</span>
        </div>
      </nav>
    </div>
    <Calculator />
  </>
}

export default App
