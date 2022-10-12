import { useState, useRef } from 'react'
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

    const principalRef = useRef("");
    const interestRef = useRef("");
    const tenureInMonthsRef = useRef("");

    const preInstallmentRef = useRef("");
    const preInstallmentDurationRef = useRef("");

    const [totalInterest, setTotalInterest] = useState("0");
    const [emis, setEmis] = useState([]);

    const calculate = () => {
        if (!checkValueIsValid(principalRef.current.value)) {
            principalRef.current.value = "";
        } else if (!checkValueIsValid(interestRef.current.value)) {
            interestRef.current.value = "";
        } else if (!checkValueIsValid(tenureInMonthsRef.current.value)) {
            tenureInMonthsRef.current.value = "";
        } else if (principalRef.current.value && interestRef.current.value && tenureInMonthsRef.current.value)
            calculateEMIs();
    }

    const calculatePreInstallments = () => {
        if (!checkValueIsValid(preInstallmentRef.current.value)) {
            preInstallmentRef.current.value = "";
        } else if (!checkValueIsValid(preInstallmentDurationRef.current.value)) {
            preInstallmentDurationRef.current.value = "";
        } else if (preInstallmentRef.current.value && preInstallmentDurationRef.current.value)
            calculateEMIs();
    }

    const calculateEMIs = () => {

        const principal = principalRef.current.value;
        const interest = interestRef.current.value;
        const tenureInMonths = tenureInMonthsRef.current.value;

        const preInstallment = preInstallmentRef.current.value;
        const preInstallmentDuration = preInstallmentDurationRef.current.value;

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
                            <input type="text" inputMode="numeric" ref={principalRef} onBlur={calculate} className="form-control" id="principal" placeholder="Principal Amount" />
                            <label htmlFor="principal" className="form-label">Principal Amount *</label>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="form-floating mb-3">
                            <input type="text" inputMode="numeric" ref={interestRef} onBlur={calculate} className="form-control" id="interest" placeholder="Interest Rate % *" />
                            <label htmlFor="interest" className="form-label">Interest Rate % *</label>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-floating">
                            <input type="text" inputMode="numeric" ref={tenureInMonthsRef} onBlur={calculate} className="form-control" id="tenureInMonths" placeholder="Tenure ( in months )" />
                            <label htmlFor="tenureInMonths" className="form-label">Tenure ( in months ) *</label>
                        </div>
                    </div>

                </div>

                <hr />

                <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                        <div className="form-floating">
                            <input type="text" inputMode="numeric" ref={preInstallmentRef} onBlur={calculatePreInstallments} className="form-control" id="preInstallment" placeholder="Pre Installment Amount" />
                            <label htmlFor="preInstallment" className="form-label">Pre Installment Amount</label>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-floating">
                            <input type="text" inputMode="numeric" ref={preInstallmentDurationRef} onBlur={calculatePreInstallments} className="form-control" id="preInstallmentDuration" placeholder="Pre Installment Duration ( Months )" />
                            <label htmlFor="preInstallmentDuration" className="form-label">Pre Installment Duration ( Months )</label>
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
