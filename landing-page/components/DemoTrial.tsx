import React from 'react';
import { useRouter } from 'next/router';
import styles from './DemoTrial.module.css';

const DemoTrial: React.FC = () => {
    const router = useRouter();

    const handleWaitlistClick = () => {
        router.push('/contact#waitlist');
    };

    return (
        <div className={styles.demoTrial}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            <span className={styles.titleLine1}>Prêt à révolutionner</span>
                            <span className={styles.titleLine2}>votre gestion des déchets ?</span>
                        </h2>
                        
                        <div className={styles.description}>
                            <p>
                                Rejoignez des milliers d'organisations qui transforment<br />
                                leur gestion des déchets avec Collectam.
                            </p>
                        </div>
                    </div>
                    
                    <div className={styles.buttonGroup}>
                        <button className={styles.signupButton} onClick={handleWaitlistClick}>
                            Rejoindre la waitinglist
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default DemoTrial;
