import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const router = useRouter();
    
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
                        <Link href="/" className={`${styles.navLink} ${router.pathname === '/' ? styles.active : ''}`}>
                            Home
                        </Link>
                        <Link href="/about" className={`${styles.navLink} ${router.pathname === '/about' ? styles.active : ''}`}>
                            About Us
                        </Link>
                        <Link href="/contact" className={`${styles.navLink} ${router.pathname === '/contact' ? styles.active : ''}`}>
                            Contact Us
                        </Link>
                    </nav>
                    
                    <div className={styles.ctaContainer}>
                        <Link href="/contact#waitlist">
                            <button className={styles.signupButton}>
                                Rejoindre la waitinglist
                            </button>
                        </Link>
                    </div>
                </div>
                <div className={styles.headerBorder}></div>
            </div>
        </header>
    );
};

export default Header;
