import React from 'react'
import './Header.css'
import logo from './logo.png'

function Header() {
    return (
        <div className = "header">
            <img
                className = "header__logo"
                src = { logo }
                alt = "logo"
            />

            <div className = "header__title">
                <h1>Path Finding Algorithm Visualizer</h1>
            </div>

            <div className = "header__navbar">
                <div className = "header__navbarOption">
                    <a 
                        className = "header__navbarLink"
                        href = "https://github.com/rahdirigs/PathFinderJS"
                        style = {{ textDecoration: 'none' }}
                    >{' '}View Code{' '}</a>
                </div>

                <div className = "header__navbarOption">
                    <a
                        className = "header__navbarLink"
                        href = "https://github.com/rahdirigs"
                        style = {{ textDecoration: 'none' }}
                    >{' '}Author's Github{' '}</a>
                </div>
            </div>
        </div>
    )
}

export default Header
