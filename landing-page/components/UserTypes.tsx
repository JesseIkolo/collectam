import React from 'react';
import styles from './UserTypes.module.css';

const UserTypes: React.FC = () => {
    return (
        <section className={styles.userTypes}>
            <div className={styles.cardsContainer}>
                {/* Card 1 - Email & SMS */}
                <div className={`${styles.card} ${styles.orangeCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/561198044c7144bae1091366f1330a3aae1fc7f4?width=960"
                                alt="Homepage Feature Card Automations Services"
                                className={styles.cardImage}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Convertir avec des e-mail et SMS
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                Générez des résultats grâce à des campagnes SMS<br />
                                parfaitement intégrées, désormais soutenues par les<br />
                                mêmes informations, la même segmentation et le<br />
                                même ciblage que les e-mails.*
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button className={styles.ctaButton}>
                                Explorer l'automatisation marketing
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Content Creation */}
                <div className={`${styles.card} ${styles.lightOrangeCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/0b288476f392ceda9d8e41465a5d1d540b2bf34b?width=960"
                                alt="Content Creation Template"
                                className={styles.cardImage}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Créer du contenu pertinent plus<br />
                            rapidement
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                Créez facilement du contenu de marque avec des<br />
                                outils d'IA générative et choisissez parmi des<br />
                                modèles conçus par des spécialistes.
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button className={styles.ctaButton}>
                                Découvrir la création de contenu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Customer Relations */}
                <div className={`${styles.card} ${styles.greyCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/af4fef7253a0d1eb540620afce40a5bc1b16766a?width=960"
                                alt="Email Builder Create Content"
                                className={styles.cardImage}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Établir des relations durables avec<br />
                            les clients
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                Utilisez des outils tels que les formulaires contextuels<br />
                                pour générer des leads. Mailchimp s'intègre<br />
                                également aux plateformes publicitaires populaires<br />
                                des réseaux sociaux afin de vous aider à stimuler<br />
                                votre croissance.
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button className={styles.ctaButton}>
                                Découvrir la génération de leads
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Analytics */}
                <div className={`${styles.card} ${styles.greyCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/f2eaa61d0ff18838c75c6f575344ea5e81d686db?width=960"
                                alt="Mailchimp Metrics Visualizer"
                                className={styles.cardImage}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Optimiser avec des analyses et des<br />
                            rapports
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                Analysez les performances grâce à des rapports, des<br />
                                visualisations en entonnoir et des analyses<br />
                                comparatives.
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
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

export default UserTypes;
