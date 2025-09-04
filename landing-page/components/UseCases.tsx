import React from 'react';
import styles from './UseCases.module.css';

const UseCases: React.FC = () => {
    return (
        <section className={styles.useCases}>
            <div className={styles.container}>
                <div className={styles.featureCard + ' ' + styles.orangeCard}>
                    <div className={styles.cardContent}>
                        <div className={styles.textContent}>
                            <h2 className={styles.featureTitle}>Convertir avec des e-mail et SMS</h2>
                            <p className={styles.featureDescription}>
                                Générez des résultats grâce à des campagnes SMS parfaitement intégrées, désormais soutenues par les mêmes informations, la même segmentation et le même ciblage que les e-mails.*
                            </p>
                            <button className={styles.ctaButton}>
                                Explorer l'automatisation marketing
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.featureCard + ' ' + styles.yellowCard}>
                    <div className={styles.cardContent}>
                        <div className={styles.textContent}>
                            <h2 className={styles.featureTitle}>Créer du contenu pertinent plus rapidement</h2>
                            <p className={styles.featureDescription}>
                                Créez facilement du contenu de marque avec des outils d'IA générative et choisissez parmi des modèles conçus par des spécialistes.
                            </p>
                            <button className={styles.ctaButton}>
                                Découvrir la création de contenu
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.featureCard + ' ' + styles.grayCard}>
                    <div className={styles.cardContent}>
                        <div className={styles.textContent}>
                            <h2 className={styles.featureTitle}>Établir des relations durables avec les clients</h2>
                            <p className={styles.featureDescription}>
                                Utilisez des outils tels que les formulaires contextuels pour générer des leads. Mailchimp s'intègre également aux plateformes publicitaires populaires des réseaux sociaux afin de vous aider à stimuler votre croissance.
                            </p>
                            <button className={styles.ctaButton}>
                                Découvrir la génération de leads
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.featureCard + ' ' + styles.grayCard}>
                    <div className={styles.cardContent}>
                        <div className={styles.textContent}>
                            <h2 className={styles.featureTitle}>Optimiser avec des analyses et des rapports</h2>
                            <p className={styles.featureDescription}>
                                Analysez les performances grâce à des rapports, des visualisations en entonnoir et des analyses comparatives.
                            </p>
                            <button className={styles.ctaButton}>
                                Explorer les analyses et les rapports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UseCases;
