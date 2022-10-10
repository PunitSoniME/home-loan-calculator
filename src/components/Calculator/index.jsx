import { useEffect, useState } from 'react'
import React from 'react'

const formatNumber = (amount) => {
    return amount ? new Intl.NumberFormat('en-IN', { maximumSignificantDigits: amount.toString().length }).format(amount) : "";
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const checkValueIsValid = (character) => {
    var p = new RegExp(/^[0-9]+([.][0-9]+)?$/);
    return Number(character) === 0 || p.test(Number(character));
}

export default function Calculator() {

    const [principal, setPrincipal] = useState("");
    const [interest, setInterest] = useState("");
    const [tenureInMonths, setTenureInMonths] = useState("");
    const [preInstallment, setPreInstallment] = useState("");
    const [preInstallmentDuration, setPreInstallmentDuration] = useState("");

    const [totalInterest, setTotalInterest] = useState("0");
    const [emis, setEmis] = useState([]);

    useEffect(() => {
        if (principal && interest && tenureInMonths)
            calculateInterest();
    }, [principal, interest, tenureInMonths]);

    useEffect(() => {
        if (preInstallment || preInstallmentDuration)
            calculateInterest();
    }, [preInstallment, preInstallmentDuration]);

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
                preInstallment: Number(preInstallment),
                principal: principalPerMonth,
                interest: interestPerMonth,
                emi: (counter % Number(preInstallmentDuration) === 0) ? (principalPerMonth + Number(preInstallment) + monthlyFixedEMI) : monthlyFixedEMI,
                balance: (counter % Number(preInstallmentDuration) === 0) ? (updatedPrincipal - Number(preInstallment) - principalPerMonth) : (updatedPrincipal - principalPerMonth)
            });

            if (counter % Number(preInstallmentDuration) === 0) {
                principalPerMonth = principalPerMonth + Number(preInstallment);
            }

            date.setMonth(date.getMonth() + 1);
            updatedPrincipal = updatedPrincipal - principalPerMonth;

            modifiedTenureInMonths = modifiedTenureInMonths - 1;
            ++counter;

        } while (updatedPrincipal > 0);

        if ((counter - 1) % Number(preInstallmentDuration) === 0 && Number(data[data.length - 1].balance) < 0) {
            data[data.length - 1].preInstallment = 0;
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

                    <div className="col-6 mb-3">
                        <div className="form-floating">
                            <input type="text" value={principal} onChange={(e) => {
                                if (checkValueIsValid(e.currentTarget.value)) {
                                    setPrincipal(e.currentTarget.value);
                                }
                            }} className="form-control" id="principal" placeholder="Principal Amount" />
                            <label htmlFor="principal" className="form-label">Principal Amount *</label>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="form-floating mb-3">
                            <input type="text" value={interest} onChange={(e) => {
                                if (checkValueIsValid(e.currentTarget.value)) {
                                    setInterest(e.currentTarget.value);
                                }
                            }} className="form-control" id="interest" placeholder="Interest Rate % *" />
                            <label htmlFor="interest" className="form-label">Interest Rate % *</label>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="form-floating">
                            <input type="text" value={tenureInMonths} onChange={(e) => {
                                if (checkValueIsValid(e.currentTarget.value)) {
                                    setTenureInMonths(e.currentTarget.value);
                                }
                            }} className="form-control" id="tenureInMonths" placeholder="Tenure ( in months )" />
                            <label htmlFor="tenureInMonths" className="form-label">Tenure ( in months ) *</label>
                        </div>
                    </div>

                </div>

                <hr />

                <div className="row">

                    <div className="col-6">
                        <div className="form-floating">
                            <input type="text" value={preInstallment} onChange={(e) => {
                                if (checkValueIsValid(e.currentTarget.value)) {
                                    setPreInstallment(e.currentTarget.value);
                                }
                            }} className="form-control" id="preInstallment" placeholder="Pre Installments (PI)" />
                            <label htmlFor="preInstallment" className="form-label">Pre Installments (PI)</label>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="form-floating">
                            <input type="text" value={preInstallmentDuration} onChange={(e) => {
                                if (checkValueIsValid(e.currentTarget.value)) {
                                    setPreInstallmentDuration(e.currentTarget.value);
                                }
                            }} className="form-control" id="preInstallmentDuration" placeholder="PI Duration" />
                            <label htmlFor="preInstallmentDuration" className="form-label">PI Duration</label>
                        </div>
                    </div>

                </div>

                <hr />

                {
                    emis.length > 0 ? <div className="alert alert-danger fw-bold" role="alert">
                        Total Interest - {totalInterest}
                    </div> : ""
                }

                {
                    emis.length > 0 ?
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
                                                        d.preInstallment && ((index + 1) % preInstallmentDuration === 0) ? ` + ${formatNumber(preInstallment)}` : ""
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
                        </div> : ""
                }

            </div>

        </div>
    )
}
