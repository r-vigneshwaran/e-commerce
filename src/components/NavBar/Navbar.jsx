import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons'
import logo from '../../assests/commerce.png'
import useStyles from './styles'
import { Link, useLocation } from 'react-router-dom'


const Navbar = ({ totalItems }) => {
    const classes = useStyles();
    const location = useLocation();
    const isCart = location === "/cart" ? true : false;
    console.log(location.pathname);
    return (
        <div>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to="/" variant='h6' className={classes.title} color="inherit">
                        <img src={logo} alt='commerce.js' height="25px" ClassName={classes.imagine} />
                        Commercify
                    </Typography>
                    <div className={classes.grow} />
                    {location.pathname === '/' && (
                        <div className={classes.button}>
                            <IconButton component={Link} to="/cart" aria-label="show cart items" color="inherit" hidden={isCart}  >
                                <Badge badgeContent={totalItems} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </div>)}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
