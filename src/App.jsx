import { useState } from 'react'
import './App.css'

function App() {

  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [additionalAmountPerMonth, setAdditionalAmountPerMonth] = useState(0);

  const [emis, setEmis] = useState([]);

  const formatNumber = (amount) => {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: amount.toString().length }).format(amount);
  }

  const calculateInterest = () => {
    let updatedPrincipal = principal;
    let modifiedTenure = tenure;
    let counter = 1;

    let updatedInterest = interest / 100 / 12;

    var x = Math.pow(1 + updatedInterest, modifiedTenure);
    let monthlyFixedEMI = Math.round((principal * x * updatedInterest) / (x - 1));

    let data = [];
    let date = new Date();

    do {

      let interestPerMonth = Math.round(updatedInterest * updatedPrincipal);
      let principalPerMonth = Math.round(monthlyFixedEMI - interestPerMonth);

      if (counter % additionalAmountPerMonth === 0) {
        // if () {

        // } else {
        principalPerMonth = principalPerMonth + additionalAmount;
        // }
      }

      data.push({
        monthYear: `${date.getMonth() + 1}-${date.getFullYear()}`,
        principal: formatNumber(principalPerMonth),
        interest: formatNumber(interestPerMonth),
        emi: formatNumber((counter % additionalAmountPerMonth === 0) ? (principalPerMonth + monthlyFixedEMI) : monthlyFixedEMI),
        balance: formatNumber(updatedPrincipal - principalPerMonth)
      });

      date.setMonth(date.getMonth() + 1);
      updatedPrincipal = updatedPrincipal - principalPerMonth;

      modifiedTenure = modifiedTenure - 1;
      ++counter;

    } while (updatedPrincipal > 0);

    setEmis([...data]);

  }

  return (
    <div className="p-2">

      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="principal" className="form-label">Principal Amount *</label>
            <input type="number" value={principal} onChange={(e) => {
              setPrincipal(Number(e.currentTarget.value));
            }} className="form-control" id="principal" placeholder="Principal Amount" />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="interest" className="form-label">Interest Rate % *</label>
            <input type="number" value={interest} onChange={(e) => {
              setInterest(Number(e.currentTarget.value));
            }} className="form-control" id="interest" placeholder="Interest Rate %" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="tenure" className="form-label">Tenure ( in months ) *</label>
            <input type="number" value={tenure} onChange={(e) => {
              setTenure(Number(e.currentTarget.value));
            }} className="form-control" id="tenure" placeholder="Tenure ( in months )" />
          </div>
        </div>

        <hr />

        <div className="row mb-3">

          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="additionalAmount" className="form-label">Amount you want to add in monthly principal</label>
            <input type="number" value={additionalAmount} onChange={(e) => {
              setAdditionalAmount(Number(e.currentTarget.value));
            }} className="form-control" id="additionalAmount" placeholder="Amount you want to add in monthly principal" />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="additionalAmountPerMonth" className="form-label">After how many month you want to add above amount ( recursive )</label>
            <input type="number" value={additionalAmountPerMonth} onChange={(e) => {
              setAdditionalAmountPerMonth(Number(e.currentTarget.value));
            }} className="form-control" id="additionalAmountPerMonth" placeholder="After how many month you want to add above amount ( recursive )" />
          </div>

        </div>

        <hr />

        <button type="button" className="btn btn-primary" onClick={calculateInterest}>Calculate</button>

        <hr />

        <div class="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th width="300px">Month-Year</th>
                <th width="300px">Principal</th>
                <th width="300px">Interest</th>
                <th width="300px">EMI</th>
                <th width="300px">Balance</th>
              </tr>
            </thead>

            <tbody>
              {
                emis.map((d, index) => (
                  <tr key={index}>
                    <td width="300px">{d.monthYear}</td>
                    <td width="300px">{d.principal}</td>
                    <td width="300px">{d.interest}</td>
                    <td width="300px">{d.emi}</td>
                    <td width="300px">{d.balance}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>



    </div>
  )
}

export default App
