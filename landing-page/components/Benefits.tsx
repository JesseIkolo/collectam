import React from 'react';
import styles from './Benefits.module.css';

const Benefits: React.FC = () => {
    return (
        <div className={styles.benefits}>
            <div className={styles.backgroundImage}>
                <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/24989868698f313ad34d7d5a4c42d01e74099093?width=4762" 
                    alt="Lake with mountains and pine trees"
                    className={styles.backgroundImg}
                />
            </div>
            
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.badge}>
                            <span>Benefits</span>
                        </div>
                        
                        <div className={styles.titleSection}>
                            <div className={styles.decorativeLine}>
                                <svg width="290" height="26" viewBox="0 0 290 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 9.08496H215.167L67.833 17.085H281.5" stroke="#3BB976" strokeOpacity="0.35" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1"/>
                                </svg>
                            </div>
                            
                            <h2 className={styles.title}>
                                Regeneration not only for<br />
                                your agriculture, but for the<br />
                                world.
                            </h2>
                            
                            <p className={styles.description}>
                                We play a vital role in promoting regenerative practices, not only in<br />
                                agriculture but also in restoring balance to our ecosystems.
                            </p>
                        </div>
                        
                        <button className={styles.ctaButton}>
                            Get Template
                        </button>
                    </div>
                    
                    <div className={styles.dashboardPreview}>
                        <img 
                            src="https://api.builder.io/api/v1/image/assets/TEMP/cfec546a4688e61258a631af41349c8924833259?width=2272"
                            alt="Dashboard"
                            className={styles.dashboardImage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Benefits;
