import React from 'react';
import styles from './Features.module.css';

const Features: React.FC = () => {
    return (
        <div className={styles.features}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Features</span>
                    <h2 className={styles.title}>
                        Have a 360 view to manage<br />
                        your farm like never before
                    </h2>
                </div>

                <div className={styles.featuresGrid}>
                    {/* Fields Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <div className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 6.44901V13.95C15 14.149 14.921 14.34 14.78 14.48C14.64 14.621 14.449 14.7 14.25 14.7H8.25V6.44901H15ZM6.75 10.949V14.7H0.75C0.551 14.7 0.36 14.621 0.22 14.48C0.079 14.34 0 14.149 0 13.95V10.949H6.75ZM6.75 1.20001V9.44901H0V1.95001C0 1.75101 0.079 1.56001 0.22 1.42001C0.36 1.27901 0.551 1.20001 0.75 1.20001H6.75ZM14.25 1.20001C14.449 1.20001 14.64 1.27901 14.78 1.42001C14.921 1.56001 15 1.75101 15 1.95001V4.94901H8.25V1.20001H14.25Z" fill="#1DAF61"/>
                                    </svg>
                                    <span>Fields</span>
                                </div>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Manage your farm,<br />
                                scale your farm and<br />
                                still sustainable.
                            </h3>
                            <p className={styles.featureDescription}>
                                We play a vital role in promoting regenerative practices, not only in agriculture but also in restoring balance to our ecosystems.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.fieldCard}>
                                <div className={styles.fieldHeader}>
                                    <span className={styles.fieldTitle}>Field 237</span>
                                    <span className={styles.fieldSubtitle}>Acres</span>
                                </div>
                                <div className={styles.fieldStats}>
                                    <div className={styles.fieldStat}>
                                        <span className={styles.statLabel}>Organic Revenue</span>
                                        <span className={styles.statValue}>5.2 T</span>
                                    </div>
                                    <div className={styles.fieldStat}>
                                        <span className={styles.statLabel}>Crop Quantity</span>
                                        <span className={styles.statValue}>300 MT</span>
                                    </div>
                                </div>
                                <div className={styles.fieldProgress}>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill}></div>
                                    </div>
                                    <span className={styles.progressText}>FIELD 237</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <div className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.25 2.19401V15.706C14.248 15.903 14.169 16.091 14.03 16.231C13.891 16.37 13.702 16.449 13.505 16.45H1.495C1.297 16.45 1.108 16.372 0.968 16.232C0.829 16.093 0.75 15.903 0.75 15.706V2.19401C0.752 1.99701 0.831 1.80901 0.97 1.66901C1.109 1.53001 1.298 1.45101 1.495 1.45001H13.505C13.916 1.45001 14.25 1.78301 14.25 2.19401ZM6.97 9.79101L5.113 7.93401L4.053 8.99601L6.97 11.912L11.212 7.67001L10.152 6.60901L6.97 9.79101Z" fill="#1DAF61"/>
                                    </svg>
                                    <span>Tasks</span>
                                </div>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Get all the duties<br />
                                ready to plant and<br />
                                grow!
                            </h3>
                            <p className={styles.featureDescription}>
                                We play a vital role in promoting regenerative practices, not only in agriculture but also in restoring balance to our ecosystems.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.tasksPanel}>
                                <div className={styles.taskColumns}>
                                    <div className={styles.taskColumn}>
                                        <div className={styles.columnHeader}>
                                            <span className={styles.columnTitle}>To Do</span>
                                            <span className={styles.taskCount}>2</span>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Water 4 Acres of Wheat</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>High</span>
                                                <span className={styles.taskDate}>Sep 24 - Oct 6</span>
                                            </div>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Plant 4 Acre of Wheat</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>Medium</span>
                                                <span className={styles.taskDate}>Sep 24 - Oct 6</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.taskColumn}>
                                        <div className={styles.columnHeader}>
                                            <span className={styles.columnTitle}>In Progress</span>
                                            <span className={styles.taskCount}>3</span>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>The Harvest is Plentiful</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>High</span>
                                                <span className={styles.taskDate}>Sep 24</span>
                                            </div>
                                        </div>
                                        <div className={styles.taskItem}>
                                            <span className={styles.taskText}>Nurture the Soil</span>
                                            <div className={styles.taskMeta}>
                                                <span className={styles.taskPriority}>Medium</span>
                                                <span className={styles.taskDate}>Sep 24</span>
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
                                <div className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.98799 3.74499C7.29199 3.16599 7.70999 2.65299 8.21599 2.23899C8.72299 1.82399 9.30799 1.51599 9.93599 1.33199C10.564 1.14899 11.223 1.09299 11.873 1.16999C12.523 1.24599 13.151 1.45199 13.719 1.77599C14.288 2.10099 14.785 2.53599 15.182 3.05699C15.578 3.57699 15.866 4.17199 16.028 4.80599C16.19 5.44099 16.222 6.10099 16.123 6.74799C16.024 7.39499 15.796 8.01499 15.453 8.57199C16.054 9.13799 16.472 9.873 16.651 10.679C16.831 11.486 16.764 12.328 16.459 13.096C16.154 13.864 15.626 14.523 14.942 14.987C14.259 15.452 13.451 15.7 12.625 15.7L6.24999 15.699C5.43099 15.699 4.62099 15.53 3.86999 15.205C3.11899 14.88 2.44199 14.404 1.88199 13.807C1.32099 13.211 0.888993 12.506 0.610993 11.736C0.332993 10.965 0.215993 10.147 0.265993 9.33C0.315993 8.512 0.533993 7.71399 0.903993 6.98399C1.27399 6.25399 1.78999 5.60799 2.41999 5.08399C3.04999 4.56099 3.77999 4.17199 4.56499 3.94199C5.35099 3.71099 6.17499 3.64399 6.98799 3.74399V3.74499Z" fill="#1DAF61"/>
                                    </svg>
                                    <span>Weather</span>
                                </div>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Crops flying on the sky<br />
                                never more. Be prepared<br />
                                on any weather.
                            </h3>
                            <p className={styles.featureDescription}>
                                We play a vital role in promoting regenerative practices, not only in agriculture but also in restoring balance to our ecosystems.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.weatherPanel}>
                                <div className={styles.weatherCard}>
                                    <div className={styles.weatherHeader}>
                                        <span className={styles.weatherTitle}>Wind Status</span>
                                        <span className={styles.seeAll}>See All</span>
                                    </div>
                                    <div className={styles.windSpeed}>
                                        <span className={styles.windValue}>8</span>
                                        <span className={styles.windUnit}>km/h</span>
                                    </div>
                                </div>
                                <div className={styles.weatherCard}>
                                    <div className={styles.weatherHeader}>
                                        <span className={styles.weatherTitle}>Week Weather</span>
                                    </div>
                                    <div className={styles.weatherToday}>
                                        <div className={styles.weatherIcon}>☀️</div>
                                        <span className={styles.temperature}>29°C</span>
                                    </div>
                                    <div className={styles.weatherTomorrow}>
                                        <div className={styles.weatherIcon}>☁️</div>
                                        <span className={styles.temperature}>22°C</span>
                                    </div>
                                </div>
                                <div className={styles.uvIndex}>
                                    <span className={styles.uvTitle}>UV Index</span>
                                    <span className={styles.uvValue}>2</span>
                                    <span className={styles.uvLevel}>Low</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Energy Feature */}
                    <div className={styles.featureCard}>
                        <div className={styles.featureContent}>
                            <div className={styles.featureHeader}>
                                <div className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.25 8.45001H12.5L5.75 18.2V11.45H0.5L7.25 1.70001V8.45001Z" fill="#1DAF61"/>
                                    </svg>
                                    <span>Energy</span>
                                </div>
                            </div>
                            <h3 className={styles.featureTitle}>
                                Be aware of your<br />
                                energergizing. Don't<br />
                                lose any more data for<br />
                                your farm
                            </h3>
                            <p className={styles.featureDescription}>
                                We play a vital role in promoting regenerative practices, not only in agriculture but also in restoring balance to our ecosystems.
                            </p>
                        </div>
                        <div className={styles.featureVisual}>
                            <div className={styles.energyPanel}>
                                <div className={styles.energyCard}>
                                    <div className={styles.energyHeader}>
                                        <span className={styles.energyTitle}>Regenerative</span>
                                    </div>
                                    <div className={styles.energyValue}>
                                        <span className={styles.energyNumber}>3024 W</span>
                                        <span className={styles.energyChange}>+5.4%</span>
                                    </div>
                                </div>
                                <div className={styles.energyCard}>
                                    <div className={styles.energyTitle}>Energy M</div>
                                    <div className={styles.energyValue}>
                                        <span className={styles.energyNumber}>219.3 W</span>
                                    </div>
                                </div>
                                <div className={styles.solarPanel}>
                                    <div className={styles.solarIcon}>🔋</div>
                                    <span className={styles.solarValue}>2531 W</span>
                                </div>
                                <div className={styles.energyStorage}>
                                    <span className={styles.storageTitle}>Energy Storage</span>
                                    <span className={styles.storageValue}>7362 W / 10.000 W</span>
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
