import { useState, useRef, useEffect } from 'react'
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Button, TextField, Alert, Paper, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const formatNumber = (amount: number) => {
    return amount ? new Intl.NumberFormat('en-IN', { maximumSignificantDigits: amount.toString().length }).format(amount) : "";
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const checkValueIsValid = (character: string) => {
    var p = new RegExp(/^[0-9]+([.][0-9]+)?$/);
    return Number(character) === 0 || p.test(character);
}

const PRE_INSTALLEMENT_SETTINGS = {
    recurring: "recurring",
    onetime: "onetime"
};

export default function Calculator() {

    let principalRef = useRef<any>("");
    let interestRef = useRef<any>("");
    let tenureInMonthsRef = useRef<any>("");
    let preInstallmentRef = useRef<any>("");
    let preInstallmentDurationRef = useRef<any>("");
    const [preInstallmentSettings, setPreInstallmentSettings] = useState(PRE_INSTALLEMENT_SETTINGS.recurring);

    const [totalInterest, setTotalInterest] = useState("0");
    const [emis, setEmis] = useState([]);

    const calculate = () => {
        if (!checkValueIsValid(principalRef.current.value)) {
            principalRef.current.value = "";
        } else if (!checkValueIsValid(interestRef.current.value)) {
            interestRef.current.value = "";
        } else if (!checkValueIsValid(tenureInMonthsRef.current.value)) {
            tenureInMonthsRef.current.value = "";
        } else if (principalRef.current.value && interestRef.current.value && tenureInMonthsRef.current.value) {
            calculateEMIs();
        }
    }

    const calculateEMIs = () => {

        const principal = principalRef.current.value;
        const interest = interestRef.current.value;
        const tenureInMonths = tenureInMonthsRef.current.value;

        let preInstallment = preInstallmentRef.current.value;
        let preInstallmentDuration = preInstallmentDurationRef.current.value;

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
                principalWithPreinstallment: (counter % Number(preInstallmentDuration) === 0) ? `${formatNumber(principalPerMonth)} + ${formatNumber(Number(preInstallment))}` : null,
                interest: interestPerMonth,
                emi: (counter % Number(preInstallmentDuration) === 0) ? (principalPerMonth + Number(preInstallment) + monthlyFixedEMI) : monthlyFixedEMI,
                balance: (counter % Number(preInstallmentDuration) === 0) ? (updatedPrincipal - Number(preInstallment) - principalPerMonth) : (updatedPrincipal - principalPerMonth)
            });

            if (counter % Number(preInstallmentDuration) === 0) {
                principalPerMonth = principalPerMonth + Number(preInstallment);

                if (preInstallmentSettings === PRE_INSTALLEMENT_SETTINGS.onetime) {
                    preInstallmentDuration = 0;
                    preInstallment = 0;
                }
            }

            date.setMonth(date.getMonth() + 1);
            updatedPrincipal = updatedPrincipal - principalPerMonth;

            modifiedTenureInMonths = modifiedTenureInMonths - 1;
            ++counter;

        } while (updatedPrincipal > 0);

        if ((counter - 1) % Number(preInstallmentDuration) === 0 && Number(data[data.length - 1].balance) < 0) {
            data[data.length - 1].preInstallment = 0;
            data[data.length - 1].principalWithPreinstallment = formatNumber(data[data.length - 1].principal);
            data[data.length - 1].emi = monthlyFixedEMI;
            data[data.length - 1].balance = 0;
        }

        let calculatedTotalInterest = 0;
        data.forEach(f => {
            calculatedTotalInterest = calculatedTotalInterest + f.interest;
        })

        setTotalInterest(formatNumber(calculatedTotalInterest));
        setEmis([...data]);

    }

    const handleChange = (event) => {
        setPreInstallmentSettings(event.target.value);
    }

    useEffect(() => {
        calculate();
    }, [preInstallmentSettings]);

    return (
        <Grid2 container spacing={2}>

            <Grid2 sm={6} xs={12}>
                <Grid2 container spacing={2} px={0}>
                    <Grid2 xs={6}>
                        <TextField fullWidth id="principal" inputRef={principalRef} label="Principal Amount" required={true} defaultValue="100000"
                            variant="outlined" type="number" inputMode="numeric" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} autoFocus
                            onFocus={() => { principalRef.current.select(); }}
                            onBlur={() => {
                                if (Number(principalRef.current.value) < 100000) {
                                    principalRef.current.value = "100000";
                                    calculate();
                                } else {
                                    calculate();
                                }
                            }} />
                    </Grid2>
                    <Grid2 xs={6}>
                        <TextField fullWidth id="interest" inputRef={interestRef} label="Interest Rate %" required={true}
                            variant="outlined" type="number" inputMode="numeric" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onFocus={() => { interestRef.current.select(); }} onBlur={calculate} />
                    </Grid2>
                    <Grid2 xs={12}>
                        <TextField fullWidth id="tenureInMonths" inputRef={tenureInMonthsRef} label="Tenure ( in months )" required={true}
                            variant="outlined" type="number" inputMode="numeric" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onFocus={() => { tenureInMonthsRef.current.select(); }} onBlur={calculate} />
                    </Grid2>
                </Grid2>

                <Grid2 container spacing={2} px={0}>

                    <Grid2 xs={12}>
                        <FormControl>
                            <FormLabel id="pre-installment-detaills">Pre Installement Details</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="pre-installment-detaills"
                                name="pre-installment-detaills-group"
                                value={preInstallmentSettings}
                                onChange={handleChange}
                            >
                                <FormControlLabel value={PRE_INSTALLEMENT_SETTINGS.recurring} control={<Radio />} label="Recurring" />
                                <FormControlLabel value={PRE_INSTALLEMENT_SETTINGS.onetime} control={<Radio />} label="One Time" />
                            </RadioGroup>
                        </FormControl>
                    </Grid2>

                    <Grid2 xs={12}>
                        <TextField fullWidth id="preInstallment" inputRef={preInstallmentRef} label="Pre Installment Amount" required={false}
                            variant="outlined" type="number" inputMode="numeric" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onFocus={() => { preInstallmentRef.current.select(); }} onBlur={calculate} />
                    </Grid2>
                    <Grid2 xs={12}>
                        <TextField fullWidth id="preInstallmentDuration" inputRef={preInstallmentDurationRef} label="Pre Installment Duration ( Months )" required={false}
                            variant="outlined" type="number" inputMode="numeric" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onFocus={() => { preInstallmentDurationRef.current.select(); }} onBlur={calculate} />
                    </Grid2>
                </Grid2>

                {
                    emis.length > 0 ? <Box mt={2}>
                        <Alert variant="filled" severity="error" style={{ fontWeight: "bold" }}>Total Interest - {totalInterest}</Alert>
                    </Box> : ""
                }
                <Divider />
            </Grid2>

            <Grid2 sm={6} xs={12}>
                {
                    emis.length > 0 ? <TableContainer component={Paper}>
                        <Table sx={{ minWidth: "100%" }} aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ minWidth: 100 }}>Month-Year</StyledTableCell>
                                    <StyledTableCell>Principal</StyledTableCell>
                                    <StyledTableCell>Interest</StyledTableCell>
                                    <StyledTableCell>EMI</StyledTableCell>
                                    <StyledTableCell>Balance</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {emis.map((d, index) => (
                                    <StyledTableRow
                                        key={index}
                                    >
                                        <StyledTableCell component="th" scope="row">
                                            {d.monthYear}
                                        </StyledTableCell>
                                        <StyledTableCell>{d.principalWithPreinstallment ? d.principalWithPreinstallment : formatNumber(d.principal)}
                                        </StyledTableCell>
                                        <StyledTableCell>{formatNumber(d.interest)}</StyledTableCell>
                                        <StyledTableCell>{formatNumber(d.emi)}</StyledTableCell>
                                        <StyledTableCell>{d.balance <= 0 ? "0" : formatNumber(d.balance)}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> : ""
                }
            </Grid2>
        </Grid2>
    )
}
