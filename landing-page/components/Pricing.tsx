import React, { useState } from 'react';
import styles from './Pricing.module.css';

const Pricing: React.FC = () => {
    const [isYearly, setIsYearly] = useState(true);

    const checkIcon = (
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_30_1508)">
                <path d="M6.31249 8.39184L14.0682 0.807617L15.2621 1.97416L6.31249 10.725L0.942871 5.47464L2.13593 4.30809L6.31249 8.39184Z" fill="#0D111B"/>
            </g>
            <defs>
                <clipPath id="clip0_30_1508">
                    <rect width="15" height="11" fill="white" transform="translate(0.5 0.275391)"/>
                </clipPath>
            </defs>
        </svg>
    );

    return (
        <div id="pricing" className={styles.pricing}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.decorativeLine}>
                        <svg width="353" height="25" viewBox="0 0 353 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 8.56543H246.667L99.333 16.5654H313" stroke="#3BB976" strokeOpacity="0.35" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1"/>
                        </svg>
                    </div>
                    
                    <div className={styles.badge}>
                        <span>Pricing</span>
                    </div>
                    
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            Choose your best way to<br />
                            save the world and your<br />
                            money
                        </h2>
                        
                        <p className={styles.description}>
                            We play a vital role in promoting regenerative practices, not only in<br />
                            agriculture but also in restoring balance to our ecosystems.
                        </p>
                    </div>
                </div>
                
                <div className={styles.plansSection}>
                    <div className={styles.toggle}>
                        <div className={styles.toggleSwitch}>
                            <div className={`${styles.toggleSlider} ${isYearly ? styles.yearlyActive : ''}`}></div>
                            <button 
                                className={`${styles.toggleOption} ${!isYearly ? styles.active : ''}`}
                                onClick={() => setIsYearly(false)}
                            >
                                Monthly
                            </button>
                            <button 
                                className={`${styles.toggleOption} ${isYearly ? styles.active : ''}`}
                                onClick={() => setIsYearly(true)}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.plans}>
                        {/* Basic Plan */}
                        <div className={styles.planCard}>
                            <div className={styles.planContent}>
                                <div className={styles.planHeader}>
                                    <h3 className={styles.planType}>Basic</h3>
                                    <div className={styles.priceSection}>
                                        <span className={styles.price}>{isYearly ? '$109' : '$129'}</span>
                                        <div className={styles.discountBadge}>
                                            <span>30% OFF</span>
                                        </div>
                                    </div>
                                    <p className={styles.planDescription}>Perfect for small teams and startups</p>
                                </div>
                                
                                <button className={styles.ctaButton}>
                                    Get Template
                                </button>
                                
                                <div className={styles.divider}>
                                    <svg width="333" height="4" viewBox="0 0 333 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.59933 1.77539H330.667" stroke="#E1E4EA" strokeWidth="1.04849"/>
                                    </svg>
                                </div>
                                
                                <div className={styles.features}>
                                    <h4 className={styles.featuresTitle}>Basic Plan includes</h4>
                                    <div className={styles.featuresList}>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Collaborate with up to 3 teammates</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Core task management features</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Unlimited projects and tasks</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Board and list views</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Basic integrations</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Pro Plan */}
                        <div className={`${styles.planCard} ${styles.featured}`}>
                            <div className={styles.planContent}>
                                <div className={styles.planHeader}>
                                    <h3 className={styles.planType}>Pro</h3>
                                    <div className={styles.priceSection}>
                                        <span className={styles.price}>{isYearly ? '$210' : '$250'}</span>
                                        <div className={styles.discountBadge}>
                                            <span>30% OFF</span>
                                        </div>
                                    </div>
                                    <p className={styles.planDescription}>Advanced tools for growing teams.</p>
                                </div>
                                
                                <button className={styles.ctaButton}>
                                    Get Template
                                </button>
                                
                                <div className={styles.divider}>
                                    <svg width="333" height="4" viewBox="0 0 333 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.59933 1.77539H330.667" stroke="#E1E4EA" strokeWidth="1.04849"/>
                                    </svg>
                                </div>
                                
                                <div className={styles.features}>
                                    <h4 className={styles.featuresTitle}>Basic Plan includes</h4>
                                    <div className={styles.featuresList}>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Collaborate with up to 10 teammates</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Core task management features</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Advanced tracking & reports</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Priority integrations</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Email support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Enterprise Plan */}
                        <div className={styles.planCard}>
                            <div className={styles.planContent}>
                                <div className={styles.planHeader}>
                                    <h3 className={styles.planType}>Enterprise</h3>
                                    <div className={styles.priceSection}>
                                        <span className={styles.price}>{isYearly ? '$268' : '$320'}</span>
                                        <div className={styles.discountBadge}>
                                            <span>30% OFF</span>
                                        </div>
                                    </div>
                                    <p className={styles.planDescription}>Full collaboration for big teams.</p>
                                </div>
                                
                                <button className={styles.ctaButton}>
                                    Get Template
                                </button>
                                
                                <div className={styles.divider}>
                                    <svg width="333" height="4" viewBox="0 0 333 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.59933 1.77539H330.667" stroke="#E1E4EA" strokeWidth="1.04849"/>
                                    </svg>
                                </div>
                                
                                <div className={styles.features}>
                                    <h4 className={styles.featuresTitle}>Basic Plan includes</h4>
                                    <div className={styles.featuresList}>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Up to 25 teammates</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Unlimited workflows & automations</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Real-time analytics</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Premium integrations</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <div className={styles.checkIcon}>{checkIcon}</div>
                                            <span>Priority support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
