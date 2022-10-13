import { lazy, Suspense, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import Information from './components/Information';

import './App.css'

const Calculator = lazy(() => import('./components/Calculator'));

function App() {

  const [showInfo, setShowInfo] = useState(false);

  return <>

    <AppBar position="static" style={{ marginBottom: 10 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Home Loan Calculator
        </Typography>

        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={() => {
            setShowInfo(prevState => !prevState)
          }}
          color="inherit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#ffffff", transform: "", msFilter: "" }}>
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path>
          </svg>
        </IconButton>
      </Toolbar>
    </AppBar>

    <Suspense fallback={<></>}>
      <Box padding={1}>
        <Calculator />
      </Box>
    </Suspense>

    <Information showInfo={showInfo} setShowInfo={setShowInfo} />

  </>
}

export default App
