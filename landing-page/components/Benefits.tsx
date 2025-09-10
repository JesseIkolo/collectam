import React, { useState, useEffect } from 'react';
import styles from './Benefits.module.css';

const Benefits: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const benefits = [
        {
            title: "Impact Environnemental",
            description: "Réduisez votre empreinte carbone de 50% grâce à nos solutions intelligentes de gestion des déchets."
        },
        {
            title: "Économies Garanties",
            description: "Diminuez vos coûts opérationnels de 30% avec l'optimisation automatique des tournées de collecte."
        },
        {
            title: "Analytics Avancés",
            description: "Suivez vos performances en temps réel avec des tableaux de bord détaillés et des rapports personnalisés."
        },
        {
            title: "Efficacité Maximale",
            description: "Automatisez vos processus et gagnez jusqu'à 40% de temps sur la gestion de vos déchets."
        },
        {
            title: "Intégration Facile",
            description: "Connectez Collectam à vos systèmes existants en quelques clics grâce à notre API flexible."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % benefits.length);
        }, 4000);
        
        return () => clearInterval(interval);
    }, [benefits.length]);

    return (
        <div id="benefits" className={styles.benefits}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span>Benefits</span>
                    </div>
                    
                    <h2 className={styles.title}>
                        Les avantages révolutionnaires<br />
                        de Collectam
                    </h2>
                    
                    <p className={styles.description}>
                        Découvrez comment Collectam transforme la gestion des déchets en une opportunité<br />
                        d'économies, d'efficacité et d'impact environnemental positif.
                    </p>
                </div>

                <div className={styles.carousel}>
                    <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} className={styles.benefitCard}>
                                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                                <p className={styles.benefitDescription}>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.carouselIndicators}>
                        {benefits.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Benefits;
