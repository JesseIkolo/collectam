import React from 'react';
import styles from './UseCases.module.css';

const UseCases: React.FC = () => {
    return (
        <div className={styles.useCases}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.decorativeLine}>
                        <svg width="292" height="25" viewBox="0 0 292 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.5 8.9751H216.167L68.833 16.9751H282.5" stroke="#3BB976" strokeOpacity="0.35" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1"/>
                        </svg>
                    </div>
                    
                    <div className={styles.badge}>
                        <span>Use Cases</span>
                    </div>
                    
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            Regeneration not only for your<br />
                            agroculture, but for the world.
                        </h2>
                        
                        <p className={styles.description}>
                            We play a vital role in promoting regenerative practices, not only in<br />
                            agriculture but also in restoring balance to our ecosystems.
                        </p>
                    </div>
                    
                    <button className={styles.ctaButton}>
                        Explore Cases
                    </button>
                </div>
                
                <div className={styles.caseStudy}>
                    <div className={styles.mainCard}>
                        <div className={styles.cardContent}>
                            <div className={styles.cardImage}>
                                <img 
                                    src="https://api.builder.io/api/v1/image/assets/TEMP/e8108bf52faac3419ad86f1e97f81e95e5e43c57?width=1788"
                                    alt="Open field with fences separating the crops, with animals and machinery around"
                                    className={styles.backgroundImage}
                                />
                                <div className={styles.gradient}></div>
                            </div>
                            
                            <div className={styles.cardHeader}>
                                <img 
                                    src="https://api.builder.io/api/v1/image/assets/TEMP/33bfb4e68d5b473b5b182cf158e66b9a3f2a1659?width=436"
                                    alt="Biosynthesis Logo"
                                    className={styles.logo}
                                />
                            </div>
                            
                            <div className={styles.cardTitle}>
                                <h3>Know how Biosynthesis™ increased their ROI more than 31x with us</h3>
                            </div>
                        </div>
                        
                        <div className={styles.statsSection}>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>
                                    <span className={styles.statSign}>+</span>
                                    <span className={styles.statNumber}>350T</span>
                                </div>
                                <div className={styles.statLabel}>more of crops harvested</div>
                            </div>
                            
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>
                                    <span className={styles.statSign}>+</span>
                                    <span className={styles.statNumber}>1.1M</span>
                                </div>
                                <div className={styles.statLabel}>
                                    liters of water saved per<br />
                                    cycle
                                </div>
                            </div>
                            
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>
                                    <span className={styles.statSign}>+</span>
                                    <span className={styles.statNumber}>380K</span>
                                </div>
                                <div className={styles.statLabel}>
                                    plants optimized with<br />
                                    better nutrients
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.companiesSection}>
                        <div className={styles.companyItem + ' ' + styles.active}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/8dbaab5c4f9a76137c5d55105bd46ae178b3cb94?width=400"
                                alt="Biosynthesis Logo"
                                className={styles.companyLogo}
                            />
                        </div>
                        
                        <div className={styles.companyItem}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/c4fac58eee500dcf0e4945e205224b8d25f02896?width=400"
                                alt="Quotient Logo"
                                className={styles.companyLogo}
                            />
                        </div>
                        
                        <div className={styles.companyItem}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/b4ff1996a729beb7589e65e717fd5cc63a4105fa?width=400"
                                alt="Hourglass Logo"
                                className={styles.companyLogo}
                            />
                        </div>
                        
                        <div className={styles.companyItem}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/f98a905d408715af3d300c3643daa86a5fab8e0e?width=400"
                                alt="GlobalBank Logo"
                                className={styles.companyLogo}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseCases;
