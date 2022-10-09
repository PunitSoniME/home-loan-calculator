import { useState } from 'react'
import './App.css'

const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: amount.toString().length }).format(amount);
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const checkValueIsValid = (character) => {
  var p = new RegExp(/^[0-9]+([.][0-9]+)?$/);
  return Number(character) === 0 || p.test(Number(character));
}

function App() {

  const [principal, setPrincipal] = useState("");
  const [interest, setInterest] = useState("");
  const [tenureInMonths, setTenureInMonths] = useState("");
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [additionalAmountPerMonth, setAdditionalAmountPerMonth] = useState("");

  const [totalInterest, setTotalInterest] = useState("0");
  const [emis, setEmis] = useState([]);

  const calculateInterest = () => {

    let updatedPrincipal = Number(principal);
    let modifiedTenureInMonths = Number(tenureInMonths);
    let counter = 1;

    let updatedInterest = Number(interest) / 100 / 12;

    var x = Math.pow(1 + updatedInterest, modifiedTenureInMonths);
    let monthlyFixedEMI = Math.round((Number(principal) * x * updatedInterest) / (x - 1));

    let data = [];
    let date = new Date();

    do {

      let interestPerMonth = Math.round(updatedInterest * updatedPrincipal);
      let principalPerMonth = Math.round(monthlyFixedEMI - interestPerMonth);

      data.push({
        monthYear: `${months[date.getMonth()]}-${date.getFullYear()}`,
        additionalAmount: Number(additionalAmount),
        principal: principalPerMonth,
        interest: interestPerMonth,
        emi: (counter % Number(additionalAmountPerMonth) === 0) ? (principalPerMonth + Number(additionalAmount) + monthlyFixedEMI) : monthlyFixedEMI,
        balance: (counter % Number(additionalAmountPerMonth) === 0) ? (updatedPrincipal - Number(additionalAmount) - principalPerMonth) : (updatedPrincipal - principalPerMonth)
      });

      if (counter % Number(additionalAmountPerMonth) === 0) {
        principalPerMonth = principalPerMonth + Number(additionalAmount);
      }

      date.setMonth(date.getMonth() + 1);
      updatedPrincipal = updatedPrincipal - principalPerMonth;

      modifiedTenureInMonths = modifiedTenureInMonths - 1;
      ++counter;

    } while (updatedPrincipal > 0);

    if ((counter - 1) % Number(additionalAmountPerMonth) === 0 && Number(data[data.length - 1].balance) < 0) {
      data[data.length - 1].additionalAmount = 0;
      data[data.length - 1].emi = monthlyFixedEMI;
      data[data.length - 1].balance = 0;
    }

    let calculatedTotalInterest = 0
    data.forEach(f => {
      calculatedTotalInterest = calculatedTotalInterest + f.interest;
    })

    setTotalInterest(formatNumber(calculatedTotalInterest));
    setEmis([...data]);
  }

  return (
    <div className="p-2">

      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="principal" className="form-label fw-semibold">Principal Amount *</label>
            <input type="text" value={principal} onChange={(e) => {
              if (checkValueIsValid(e.currentTarget.value)) {
                setPrincipal(e.currentTarget.value);
              }
            }} className="form-control" id="principal" placeholder="Principal Amount" />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="interest" className="form-label fw-semibold">Interest Rate % *</label>
            <input type="text" value={interest} onChange={(e) => {
              if (checkValueIsValid(e.currentTarget.value)) {
                setInterest(e.currentTarget.value);
              }
            }} className="form-control" id="interest" placeholder="Interest Rate %" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="tenureInMonths" className="form-label fw-semibold">Tenure ( in months ) *</label>
            <input type="text" value={tenureInMonths} onChange={(e) => {
              if (checkValueIsValid(e.currentTarget.value)) {
                setTenureInMonths(e.currentTarget.value);
              }
            }} className="form-control" id="tenureInMonths" placeholder="Tenure ( in months )" />
          </div>
        </div>

        <hr />

        <div className="row mb-3">

          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="additionalAmount" className="form-label fw-semibold">Amount you want to add in monthly principal</label>
            <input type="text" value={additionalAmount} onChange={(e) => {
              if (checkValueIsValid(e.currentTarget.value)) {
                setAdditionalAmount(e.currentTarget.value);
              }
            }} className="form-control" id="additionalAmount" placeholder="Amount you want to add in monthly principal" />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="additionalAmountPerMonth" className="form-label fw-semibold">After how many months you want to add additional amount ? ( recursive )</label>
            <input type="text" value={additionalAmountPerMonth} onChange={(e) => {
              if (checkValueIsValid(e.currentTarget.value)) {
                setAdditionalAmountPerMonth(e.currentTarget.value);
              }
            }} className="form-control" id="additionalAmountPerMonth" placeholder="After how many months you want to add additional amount ? ( recursive )" />
          </div>

        </div>

        <hr />

        <button disabled={!(principal && interest && tenureInMonths)} type="button" className="btn btn-primary" onClick={calculateInterest}>Calculate</button>

        <hr />

        {
          emis.length > 0 ? <div class="alert alert-danger fw-bold" role="alert">
            Total Interest - {totalInterest}
          </div> : ""
        }

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
