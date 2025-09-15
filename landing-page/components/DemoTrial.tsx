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
                            <span className={styles.titleLine1}>Collectam est plus qu'un outil :</span>
                            <span className={styles.titleLine2}>c'est un acteur clé de la durabilité</span>
                        </h2>
                        
                        <div className={styles.description}>
                            <p>
                                Rejoignez dès aujourd'hui la liste prioritaire et devenez un pionnier<br />
                                de la gestion intelligente des déchets !
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
