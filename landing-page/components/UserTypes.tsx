import React from 'react';
import styles from './UserTypes.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';

const UserTypes: React.FC = () => {
    const router = useRouter();

    const handleUserTypeClick = (userType: string) => {
        router.push(`/contact#waitlist`);
    };

    return (
        <div id="usertypes" className={styles.userTypes}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    Qui peut utiliser Collectam ?
                </h2>
                <p className={styles.sectionDescription}>
                    La production mondiale de déchets augmente à un rythme alarmant, posant un défi majeur pour l'environnement et la société.
                    Collectam apporte une réponse concrète : une plateforme innovante qui combine IoT et IA pour améliorer la collecte, réduire l'empreinte écologique et optimiser les ressources pour tous les acteurs.
                </p>
            </div>
            <div className={styles.cardsContainer}>
                {/* Card 1 - Ménages */}
                <div className={`${styles.card} ${styles.whiteCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <Image 
                                src="/menage.jpg" 
                                alt="Ménages" 
                                width={400} 
                                height={200} 
                                className={styles.cardImage}
                                quality={85}
                                priority
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Particuliers & Ménages
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                • Gérez vos déchets domestiques en toute simplicité.<br />
                                • Planifiez vos collectes depuis l'application et suivez votre impact écologique en temps réel.<br />
                                • Recevez des récompenses écoresponsables (réductions, bons d'achat, points fidélité).
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button 
                                className={styles.ctaButton}
                                onClick={() => handleUserTypeClick('menage')}
                            >
                                Rejoindre la waitinglist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Collecteurs */}
                <div className={`${styles.card} ${styles.greenCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <Image 
                                src="/collector.jpg" 
                                alt="Collecteurs" 
                                width={400} 
                                height={200} 
                                className={styles.cardImage}
                                quality={85}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Collecteurs Professionnels
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                • Optimisez vos tournées avec des itinéraires intelligents basés sur l'IA.<br />
                                • Réduisez vos coûts opérationnels (jusqu'à -30% de carburant consommé).<br />
                                • Analysez vos performances et améliorez votre efficacité jour après jour.
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button 
                                className={styles.ctaButton}
                                onClick={() => handleUserTypeClick('collecteur')}
                            >
                                Rejoindre la waitinglist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Collectam Business */}
                <div className={`${styles.card} ${styles.greenCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <Image 
                                src="/collectam-business.jpg" 
                                alt="Collectam Business" 
                                width={400} 
                                height={200} 
                                className={styles.cardImage}
                                quality={85}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Solutions Business<br />
                            Avancées
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                • Bénéficiez d'une plateforme complète avec tableau de bord et suivi en temps réel.<br />
                                • Accédez à des analyses prédictives avancées pour mieux anticiper vos besoins.<br />
                                • Automatisez vos opérations pour gagner du temps et réduire vos dépenses.
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button 
                                className={styles.ctaButton}
                                onClick={() => handleUserTypeClick('collectam-business')}
                            >
                                Rejoindre la waitinglist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Entreprises */}
                <div className={`${styles.card} ${styles.whiteCard}`}>
                    <div className={styles.cardContent}>
                        <div className={styles.imageContainer}>
                            <Image 
                                src="/entreprise.jpg" 
                                alt="Entreprises" 
                                width={400} 
                                height={200} 
                                className={styles.cardImage}
                                quality={85}
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Entreprises &<br />
                            Organisations
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                • Diminuez vos coûts de gestion des déchets grâce à une planification optimisée.<br />
                                • Valorisez votre engagement RSE en réduisant votre empreinte carbone.<br />
                                • Accédez à des solutions personnalisées adaptées à votre secteur.
                            </p>
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button 
                                className={styles.ctaButton}
                                onClick={() => handleUserTypeClick('entreprise')}
                            >
                                Rejoindre la waitinglist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTypes;
