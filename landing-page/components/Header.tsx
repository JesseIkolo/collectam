import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.headerContent}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}></div>
                        </div>
                        <div className={styles.divider}></div>
                    </div>
                    
                    <nav className={styles.navigation}>
                        <a href="#home" className={styles.navLink}>Home</a>
                        <a href="#about-us" className={styles.navLink}>About Us</a>
                        <a href="#contact-us" className={styles.navLink}>Contact Us</a>
                        <a href="#blog" className={styles.navLink}>Blog</a>
                    </nav>
                    
                    <div className={styles.ctaContainer}>
                        <button className={styles.loginButton}>
                            Se connecter
                        </button>
                        <button className={styles.signupButton}>
                            S'inscrire
                        </button>
                    </div>
                </div>
                <div className={styles.headerBorder}></div>
            </div>
        </header>
    );
};

export default Header;
