import React from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.headingSection}>
                    
                    <div className={styles.content}>
                        <div className={styles.titleSection}>
                            <div className={styles.decorativeElements}>
                                <div className={styles.decorativeIcons}>
                                    <svg width="73" height="74" viewBox="0 0 73 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M33.076 67.033C30.518 68.006 27.997 68.991 25.412 69.888C24.857 70.083 24.254 69.792 24.062 69.24C23.866 68.684 24.16 68.078 24.713 67.886C27.282 66.991 29.783 66.016 32.323 65.049C32.872 64.842 33.484 65.118 33.691 65.662C33.899 66.211 33.626 66.826 33.076 67.033Z" fill="#1FC16B"/>
                                        <path d="M36.669 44.691C28.555 41.704 20.597 38.309 12.552 35.151C12.006 34.935 11.738 34.32 11.952 33.776C12.168 33.23 12.78 32.96 13.329 33.173C21.359 36.328 29.302 39.72 37.401 42.698C37.954 42.902 38.233 43.511 38.032 44.061C37.828 44.613 37.218 44.892 36.669 44.691Z" fill="#1FC16B"/>
                                        <path d="M57.223 21.255C52.939 15.332 48.815 9.28099 44.465 3.40599C44.12 2.93499 44.219 2.27099 44.687 1.92299C45.158 1.57199 45.825 1.67399 46.173 2.14199C50.526 8.02599 54.656 14.084 58.943 20.015C59.285 20.49 59.18 21.153 58.706 21.495C58.228 21.84 57.568 21.732 57.223 21.255Z" fill="#1FC16B"/>
                                    </svg>
                                    
                                    <svg width="73" height="74" viewBox="0 0 73 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M39.369 67.033C41.926 68.006 44.448 68.991 47.033 69.888C47.588 70.083 48.191 69.792 48.383 69.24C48.578 68.684 48.284 68.078 47.732 67.886C45.163 66.991 42.662 66.016 40.122 65.049C39.573 64.842 38.961 65.118 38.754 65.662C38.546 66.211 38.819 66.826 39.369 67.033Z" fill="#1FC16B"/>
                                        <path d="M35.776 44.691C43.89 41.704 51.848 38.309 59.893 35.151C60.439 34.935 60.706 34.32 60.493 33.776C60.277 33.30 59.665 32.96 59.116 33.173C51.086 36.328 43.143 39.72 35.044 42.698C34.491 42.902 34.212 43.511 34.413 44.061C34.617 44.613 35.227 44.892 35.776 44.691Z" fill="#1FC16B"/>
                                        <path d="M15.222 21.255C19.506 15.332 23.63 9.28099 27.98 3.40599C28.325 2.93499 28.226 2.27099 27.758 1.92299C27.287 1.57199 26.62 1.67399 26.272 2.14199C21.919 8.02599 17.789 14.084 13.502 20.015C13.16 20.49 13.265 21.153 13.739 21.495C14.216 21.84 14.877 21.732 15.222 21.255Z" fill="#1FC16B"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <div className={styles.title}>
                                <h1 className={styles.titleText}>
                                    <span className={styles.titleLine1}>Optimisons la collecte </span>
                                    <span className={styles.titleLine2}>des dechets,avec Collectam</span>
                                </h1>
                            </div>
                        </div>
                        
                        <div className={styles.subtitle}>
                            <p className={styles.subtitleText}>
                                Our platform empowers agriculture to restore ecosystems,
                                <br />
                                turning you farm a regenerative success story.
                            </p>
                        </div>
                    </div>
                    
                    <div className={styles.buttonGroup}>
                        <Link href="/contact#waitlist">
                            <button className={styles.primaryButton}>
                                Rejoindre la waitinglist
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default HeroSection;
