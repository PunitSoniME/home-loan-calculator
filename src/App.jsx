import { useState } from 'react'
import './App.css'

const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: amount.toString().length }).format(amount);
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function App() {

  const [principal, setPrincipal] = useState(3933320);
  const [interest, setInterest] = useState(8.15);
  const [tenureInMonths, setTenureInMonths] = useState(240);
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [additionalAmountPerMonth, setAdditionalAmountPerMonth] = useState(0);

  const [emis, setEmis] = useState([]);

  const calculateInterest = () => {
    let updatedPrincipal = principal;
    let modifiedTenureInMonths = tenureInMonths;
    let counter = 1;

    let updatedInterest = interest / 100 / 12;

    var x = Math.pow(1 + updatedInterest, modifiedTenureInMonths);
    let monthlyFixedEMI = Math.round((principal * x * updatedInterest) / (x - 1));

    let data = [];
    let date = new Date();

    do {

      let interestPerMonth = Math.round(updatedInterest * updatedPrincipal);
      let principalPerMonth = Math.round(monthlyFixedEMI - interestPerMonth);

      data.push({
        monthYear: `${months[date.getMonth()]}-${date.getFullYear()}`,
        additionalAmount: additionalAmount,
        principal: principalPerMonth,
        interest: interestPerMonth,
        emi: (counter % additionalAmountPerMonth === 0) ? (principalPerMonth + additionalAmount + monthlyFixedEMI) : monthlyFixedEMI,
        balance: (counter % additionalAmountPerMonth === 0) ? (updatedPrincipal - additionalAmount - principalPerMonth) : (updatedPrincipal - principalPerMonth)
      });

      if (counter % additionalAmountPerMonth === 0) {
        principalPerMonth = principalPerMonth + additionalAmount;
      }

      date.setMonth(date.getMonth() + 1);
      updatedPrincipal = updatedPrincipal - principalPerMonth;

      modifiedTenureInMonths = modifiedTenureInMonths - 1;
      ++counter;

    } while (updatedPrincipal > 0);

    if ((counter - 1) % additionalAmountPerMonth === 0 && Number(data[data.length - 1].balance) < 0) {
      data[data.length - 1].additionalAmount = 0;
      data[data.length - 1].emi = monthlyFixedEMI;
      data[data.length - 1].balance = 0;
    }

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
            <label htmlFor="tenureInMonths" className="form-label">Tenure ( in months ) *</label>
            <input type="number" value={tenureInMonths} onChange={(e) => {
              setTenureInMonths(Number(e.currentTarget.value));
            }} className="form-control" id="tenureInMonths" placeholder="Tenure ( in months )" />
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
            <label htmlFor="additionalAmountPerMonth" className="form-label">After how many month you want to add additional amount ? ( recursive )</label>
            <input type="number" value={additionalAmountPerMonth} onChange={(e) => {
              setAdditionalAmountPerMonth(Number(e.currentTarget.value));
            }} className="form-control" id="additionalAmountPerMonth" placeholder="After how many month you want to add additional amount ? ( recursive )" />
          </div>

        </div>

        <hr />

        <button disabled={!(principal && interest && tenureInMonths)} type="button" className="btn btn-primary" onClick={calculateInterest}>Calculate</button>

        <hr />

        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th>Month-Year</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>EMI</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {
                emis.map((d, index) => (
                  <tr key={index} className={d.monthYear.indexOf("Jan") > -1 ? 'fw-bold' : ''}>
                    <td>{d.monthYear}</td>
                    <td>{formatNumber(d.principal)}
                      {
                        d.additionalAmount && ((index + 1) % additionalAmountPerMonth === 0) ? ` + ${formatNumber(additionalAmount)}` : ""
                      }
                    </td>
                    <td>{formatNumber(d.interest)}</td>
                    <td>{formatNumber(d.emi)}</td>
                    <td>{formatNumber(d.balance) < 0 ? "0" : formatNumber(d.balance)}</td>
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
