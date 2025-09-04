import React from 'react';
import styles from './DemoTrial.module.css';

const DemoTrial: React.FC = () => {
    return (
        <div className={styles.demoTrial}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            <span className={styles.titleLine1}>Stay Updated with the Future</span>
                            <span className={styles.titleLine2}>of Farming</span>
                        </h2>
                        
                        <div className={styles.description}>
                            <p>
                                No spam, just the latest agro-tech trends, sustainability<br />
                                insights, and interviews with industry leaders delivered<br />
                                straight to your inbox.
                            </p>
                        </div>
                    </div>
                    
                    <div className={styles.buttonGroup}>
                        <button className={styles.signupButton}>
                            S'inscrire maintenant
                        </button>
                        <button className={styles.loginButton}>
                            Se connecter
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default DemoTrial;
