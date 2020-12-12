import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import useStyles from './styles'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm'
import { commerce } from '../../../lib/commerce'
import { Link, useHistory } from 'react-router-dom'


const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const history = useHistory();
    const [isFinished, setIsFinished] = useState(false)
    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant='h5 '>Thank You for your purchase,{order.customer.firstname},{order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2'> Order Ref: {order.customer.reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" >Back To Home</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant='h5 '>Thank You for your purchase</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" >Back To Home</Button>
        </>
    ) : (
                <div className={classes.spinner}>
                    <CircularProgress />
                </div>
            );
    if (error) {
        <>
            <Typography variant='h5' >Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" >Back To Home</Button>
        </>
    }
    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
                // console.log(token);
                setCheckoutToken(token)
            } catch (error) {
                history.push('/');
            }
        }
        generateToken();
    }, [cart])
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const next = (data) => {
        setShippingData(data);
        nextStep();
    }
    const timeOut = () => {
        setTimeout(() => { setIsFinished(true) }, 3000)

    }
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0)
    const steps = ['shipping address', 'Payment details'];
    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next} /> : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeOut={timeOut} />
    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout Form</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
