import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './CustomTextField'
import { commerce } from '../../lib/commerce'
import {Link} from 'react-router-dom'

const AdderssForm = ({ checkoutToken,next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubDivisions, setShippingSubDivisions] = useState([]);
    const [shippingSubDivision, setShippingSubDivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
    const subDivisions = Object.entries(shippingSubDivisions).map(([code, name]) => ({ id: code, label: name }));
    const options= shippingOptions.map((sO)=>({id:sO.id,label:`${sO.description}-(${sO.price.formatted_with_symbol})`}))
    console.log(options)
    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }
    const fetchSubDivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
        setShippingSubDivisions(subdivisions);
        setShippingSubDivision(Object.keys(subdivisions)[0]);
    }
    const fetchShippingOption = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
        setShippingOptions(options)
        setShippingOption(options[0].id)
    }
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    }, [])
    useEffect(() => {
        if (shippingCountry) fetchSubDivisions(shippingCountry)
    }, [shippingCountry])
    useEffect(() => {
        if (shippingSubDivision) fetchShippingOption(checkoutToken.id, shippingCountry, shippingSubDivision)
    }, [shippingSubDivision])
    return (
        <>
            <Typography variant='h6' gutterBottom >
                Shipping Form
            </Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=>next({...data,shippingCountry,shippingSubDivision,shippingOption}))}>
                    <Grid container spacing={3} >
                        <FormInput name='firstName' label='First name' />
                        <FormInput name='lastName' label='Last name' />
                        <FormInput name='address1' label='Address' />
                        <FormInput name='email' label='Email' />
                        <FormInput name='city' label='City' />
                        <FormInput name='zip' label='ZIP / Postal Code' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping SubDivision </InputLabel>
                            <Select value={shippingSubDivision} fullWidth onChange={(e) => setShippingSubDivision(e.target.value)}>
                                {subDivisions.map((sub_division) => (
                                    <MenuItem key={sub_division.id} value={sub_division.id}>
                                        {sub_division.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping SubDivision </InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                       
                    </Grid>
                    <br />
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                            <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                            <Button type="submit" color="primary" variant="contained">Next</Button>
                            
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AdderssForm
