import { CloseIcon } from 'assets/Index';
import React from 'react';
import "./Header.scss";

function Header() {

    const handleClose = () => {
        const appDiv = document.getElementById("react-chrome-extension");
        const appScript = document.getElementById("react-app-script");

        try {
            if (appDiv && appDiv.parentNode) {
                appDiv.parentNode.removeChild(appDiv);
                console.log("React app container removed.");
            }
        } catch (error) {
            console.error("Error removing appDiv:", error);
        }

        try {
            if (appScript && appScript.parentNode) {
                appScript.parentNode.removeChild(appScript);
                console.log("React app script removed.");
            }
        } catch (error) {
            console.error("Error removing appScript:", error);
        }
    };

    return (
        <div className='header'>
            <div>
                <h1>Quipo</h1>
            </div>
            <div onClick={handleClose}>
                <CloseIcon />
            </div>
        </div>
    );
}

export default Header;
