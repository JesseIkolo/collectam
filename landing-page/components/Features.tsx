import React from 'react';
import styles from './Features.module.css';

const Features: React.FC = () => {
    return (
        <div id="features" className={styles.features}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Impact</span>
                    <h2 className={styles.title}>
                        L'impact révolutionnaire de Collectam<br />
                        sur la gestion des déchets
                    </h2>
                    <p className={styles.description}>
                        Collectam combine IoT et IA pour améliorer la collecte, réduire l'empreinte écologique,
                        et optimiser les ressources. Découvrez nos fonctionnalités principales et leur impact concret.
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    {/* Fields Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <h4 className={styles.featureCategory}>Réduction des Déchets</h4>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Réduction des déchets<br />
                                via IA : jusqu'à -40%<br />
                                grâce à des prévisions précises
                            </h3>
                            <p className={styles.featureDescription}>
                                Notre intelligence artificielle analyse les patterns de production de déchets et optimise les collectes pour minimiser le gaspillage et maximiser le recyclage.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.fieldCard}>
                                <div className={styles.fieldHeader}>
                                    <span className={styles.fieldTitle}>Zone Résidentielle A</span>
                                    <span className={styles.fieldSubtitle}>Secteur</span>
                                </div>
                                <div className={styles.fieldStats}>
                                    <div className={styles.fieldStat}>
                                        <span className={styles.statLabel}>Déchets Collectés</span>
                                        <span className={styles.statValue}>2.8 T</span>
                                    </div>
                                    <div className={styles.fieldStat}>
                                        <span className={styles.statLabel}>Taux de Recyclage</span>
                                        <span className={styles.statValue}>85%</span>
                                    </div>
                                </div>
                                <div className={styles.fieldProgress}>
                                    
                                </div>
                                <div className={styles.fieldMetrics}>
                                    <div className={styles.metric}>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <h4 className={styles.featureCategory}>Tournées Intelligentes</h4>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Tournées intelligentes :<br />
                                réduction de -30% du carburant<br />
                                grâce à des itinéraires optimisés
                            </h3>
                            <p className={styles.featureDescription}>
                                L'IoT et l'IA calculent les itinéraires optimaux en temps réel, réduisant les distances parcourues et l'empreinte carbone de vos collectes.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.tasksPanel}>
                                <div className={styles.taskColumns}>
                                    <div className={styles.taskColumn}>
                                        <div className={styles.columnHeader}>
                                            <span className={styles.columnTitle}>Planifiées</span>
                                            <span className={styles.taskCount}>4</span>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Collecte Rue Victor Hugo</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>High</span>
                                                <span className={styles.taskDate}>14h30 - 15h15</span>
                                            </div>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Zone Industrielle Nord</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>Medium</span>
                                                <span className={styles.taskDate}>16h00 - 17h30</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.taskColumn}>
                                        <div className={styles.columnHeader}>
                                            <span className={styles.columnTitle}>En Cours</span>
                                            <span className={styles.taskCount}>2</span>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Centre-ville Secteur A</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>High</span>
                                                <span className={styles.taskDate}>13h45</span>
                                            </div>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Résidentiel Ouest</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>Medium</span>
                                                <span className={styles.taskDate}>14h10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weather Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <h4 className={styles.featureCategory}>Surveillance IoT</h4>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Surveillance IoT :<br />
                                capteurs connectés détectant<br />
                                en temps réel le remplissage
                            </h3>
                            <p className={styles.featureDescription}>
                                Nos capteurs IoT intelligents surveillent continuellement l'état des conteneurs et alertent automatiquement quand une collecte est nécessaire.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.weatherPanel}>
                                <div className={styles.weatherCard}>
                                    <div className={styles.weatherHeader}>
                                        <span className={styles.weatherTitle}>Conteneur #A247</span>
                                        <span className={styles.seeAll}>Actif</span>
                                    </div>
                                    <div className={styles.windSpeed}>
                                        <span className={styles.windValue}>78</span>
                                        <span className={styles.windUnit}>%</span>
                                    </div>
                                </div>
                                <div className={styles.weatherCard}>
                                    <div className={styles.weatherHeader}>
                                        <span className={styles.weatherTitle}>Prochaine Collecte</span>
                                    </div>
                                    <div className={styles.weatherToday}>
                                        <span className={styles.temperature}>2h</span>
                                    </div>
                                    <div className={styles.weatherTomorrow}>
                                        <span className={styles.temperature}>Zone B</span>
                                    </div>
                                </div>
                                <div className={styles.uvIndex}>
                                    <span className={styles.uvTitle}>Statut</span>
                                    <span className={styles.uvValue}>OK</span>
                                    <span className={styles.uvLevel}>Optimal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Energy Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <h4 className={styles.featureCategory}>Impact Environnemental</h4>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Suivi carbone :<br />
                                suivi précis de votre empreinte (-50%)<br />
                                avec rapports automatisés
                            </h3>
                            <p className={styles.featureDescription}>
                                Suivez et mesurez l'impact environnemental positif de vos actions. Chaque déchet recyclé contribue à un avenir plus durable pour notre planète.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.analyticsPanel}>
                                <div className={styles.analyticsHeader}>
                                    <h4 className={styles.panelTitle}>Prédictions IA - Semaine 42</h4>
                                    <span className={styles.accuracyBadge}>92% précision</span>
                                </div>
                                <div className={styles.predictionChart}>
                                    <div className={styles.chartBar}>
                                        <span className={styles.dayLabel}>Lun</span>
                                        <div className={styles.barContainer}>
                                            <div className={styles.predictedBar} style={{height: '60%'}}></div>
                                            <div className={styles.actualBar} style={{height: '58%'}}></div>
                                        </div>
                                        <span className={styles.volumeLabel}>2.3T</span>
                                    </div>
                                    <div className={styles.chartBar}>
                                        <span className={styles.dayLabel}>Mar</span>
                                        <div className={styles.barContainer}>
                                            <div className={styles.predictedBar} style={{height: '80%'}}></div>
                                            <div className={styles.actualBar} style={{height: '82%'}}></div>
                                        </div>
                                        <span className={styles.volumeLabel}>3.1T</span>
                                    </div>
                                    <div className={styles.chartBar}>
                                        <span className={styles.dayLabel}>Mer</span>
                                        <div className={styles.barContainer}>
                                            <div className={styles.predictedBar} style={{height: '45%'}}></div>
                                            <div className={styles.actualBar} style={{height: '43%'}}></div>
                                        </div>
                                        <span className={styles.volumeLabel}>1.8T</span>
                                    </div>
                                    <div className={styles.chartBar}>
                                        <span className={styles.dayLabel}>Jeu</span>
                                        <div className={styles.barContainer}>
                                            <div className={styles.predictedBar} style={{height: '70%'}}></div>
                                            <div className={styles.actualBar} style={{height: '68%'}}></div>
                                        </div>
                                        <span className={styles.volumeLabel}>2.7T</span>
                                    </div>
                                    <div className={styles.chartBar}>
                                        <span className={styles.dayLabel}>Ven</span>
                                        <div className={styles.barContainer}>
                                            <div className={styles.predictedBar} style={{height: '90%'}}></div>
                                        </div>
                                        <span className={styles.volumeLabel}>3.5T</span>
                                    </div>
                                </div>
                                <div className={styles.chartLegend}>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendColor} style={{backgroundColor: '#1DAF61'}}></div>
                                        <span>Prédit</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendColor} style={{backgroundColor: '#16A085'}}></div>
                                        <span>Réel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
