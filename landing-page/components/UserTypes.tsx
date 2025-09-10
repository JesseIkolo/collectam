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
                    Collectam s'adapte à tous les acteurs de la gestion des déchets, des particuliers aux grandes entreprises. 
                    Découvrez comment notre plateforme peut transformer votre approche de la collecte et du recyclage.
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
                                height={280} 
                                className={styles.cardImage}
                                quality={95}
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
                                Simplifiez la gestion de vos déchets domestiques.<br />
                                Planifiez vos collectes, suivez votre impact<br />
                                environnemental et gagnez des récompenses<br />
                                pour vos efforts écologiques.
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
                                height={280} 
                                className={styles.cardImage}
                                quality={95}
                                priority
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Collecteurs Professionnels
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                Optimisez vos tournées de collecte avec notre<br />
                                technologie IoT. Gérez vos missions, suivez<br />
                                vos performances et maximisez votre efficacité<br />
                                opérationnelle.
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
                                height={280} 
                                className={styles.cardImage}
                                quality={95}
                                priority
                            />
                        </div>
                        <h3 className={styles.cardTitle}>
                            Collectam Business<br />
                            Solutions Avancées
                        </h3>
                    </div>
                    
                    <div className={styles.cardDescription}>
                        <div className={styles.descriptionText}>
                            <p>
                                Accédez à notre plateforme complète de gestion<br />
                                des déchets. Gérez les organisations, supervisez<br />
                                les opérations et accédez aux analytics avancés<br />
                                pour optimiser votre activité.
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
                                height={280} 
                                className={styles.cardImage}
                                quality={95}
                                priority
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
                                Réduisez vos coûts de gestion des déchets<br />
                                et améliorez votre empreinte environnementale.<br />
                                Solutions sur mesure pour entreprises<br />
                                de toutes tailles.
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
