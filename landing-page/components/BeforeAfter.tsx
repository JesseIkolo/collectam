import React from 'react';
import styles from './BeforeAfter.module.css';

const BeforeAfter: React.FC = () => {
    return (
        <div id="before-after" className={styles.beforeAfter}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    La Révolution de la Gestion des Déchets
                </h2>
                <p className={styles.sectionDescription}>
                    Découvrez comment Collectam transforme radicalement la gestion des déchets : 
                    de méthodes traditionnelles inefficaces vers une solution intelligente, 
                    automatisée et respectueuse de l'environnement.
                </p>
            </div>
            
            <div className={styles.comparisonContainer}>
                {/* Section Avant */}
                <div className={styles.beforeSection}>
                    <div className={styles.sectionLabel}>
                        <h3 className={styles.labelTitle}>AVANT</h3>
                        <p className={styles.labelSubtitle}>Méthodes traditionnelles</p>
                    </div>
                    
                    <div className={styles.imageContainer}>
                        <div className={styles.imagePlaceholder + ' ' + styles.beforeImage}>
                            {/* Espace pour image "avant" */}
                        </div>
                    </div>
                    
                    <div className={styles.contentList}>
                        <ul className={styles.problemsList}>
                            <li>Collectes inefficaces et imprévisibles</li>
                            <li>Gaspillage de carburant et de temps</li>
                            <li>Manque de visibilité sur les tournées</li>
                            <li>Impact environnemental élevé</li>
                            <li>Coûts opérationnels importants</li>
                        </ul>
                    </div>
                </div>

                {/* Section Après */}
                <div className={styles.afterSection}>
                    <div className={styles.sectionLabel}>
                        <h3 className={styles.labelTitle}>APRÈS</h3>
                        <p className={styles.labelSubtitle}>Solution Collectam</p>
                    </div>
                    
                    <div className={styles.imageContainer}>
                        <div className={styles.imagePlaceholder + ' ' + styles.afterImage}>
                            {/* Espace pour image "après" */}
                        </div>
                    </div>
                    
                    <div className={styles.contentList}>
                        <ul className={styles.solutionsList}>
                            <li>Collectes optimisées par IA</li>
                            <li>Réduction de 30% des coûts</li>
                            <li>Suivi en temps réel</li>
                            <li>Empreinte carbone réduite</li>
                            <li>ROI mesurable et transparent</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfter;
