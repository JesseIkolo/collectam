import React from 'react';
import styles from './MissionHero.module.css';

const MissionHero: React.FC = () => {
  return (
    <section className={styles.missionHero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.circularImageSection}>
            <div className={styles.earthContainer}>
              <div className={styles.earth}></div>
            </div>
            
            <div className={styles.textOverlay}>
              <div className={styles.badge}>
                <span>About us</span>
              </div>
              
              <div className={styles.headingSection}>
                <h1 className={styles.heading}>
                  <span className={styles.headingLine1}>Révolutionner la gestion</span>
                  <span className={styles.headingLine2}>des déchets</span>
                </h1>
              </div>
              
              <div className={styles.supportingText}>
                <p>
                  Nous transformons la collecte des déchets grâce à l'IoT et l'IA, 
                  créant un avenir plus propre et plus durable pour nos villes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionHero;
