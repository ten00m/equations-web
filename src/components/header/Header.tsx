import React from 'react';
import classes from './Header.module.css'

const Header = () => {

    return (
        <div className={classes.header}>
            <div className={classes.header_log}>
                Solver
            </div>
            <div className={classes.header_name}>
                Калькулятор математических уравнений
            </div>
        </div>
    )
}

export default Header