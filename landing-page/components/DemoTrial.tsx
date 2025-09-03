import React from 'react';
import styles from './DemoTrial.module.css';

const DemoTrial: React.FC = () => {
    return (
        <div className={styles.demoTrial}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            <span className={styles.titleLine1}>Stay Updated with the Future</span>
                            <span className={styles.titleLine2}>of Farming</span>
                        </h2>
                        
                        <div className={styles.description}>
                            <p>
                                No spam, just the latest agro-tech trends, sustainability<br />
                                insights, and interviews with industry leaders delivered<br />
                                straight to your inbox.
                            </p>
                        </div>
                    </div>
                    
                    <button className={styles.ctaButton}>
                        Get Started
                    </button>
                </div>
                
                <div className={styles.dashboardShowcase}>
                    <div className={styles.maskContainer}>
                        <div className={styles.carousel}>
                            <div className={styles.carouselTrack}>
                                <div className={styles.carouselItem}>
                                    <div className={styles.dashboardImage}>
                                        <img 
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/245822ebc38721ad8aa9fe194bb3bd2120eee998?width=2034"
                                            alt="Dashboard Interface"
                                            className={styles.image}
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.carouselItem}>
                                    <div className={styles.fieldsImage}>
                                        <img 
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/b869c325a91fbf264526570c8509d8c8680b24fb?width=2016"
                                            alt="Fields Dashboard"
                                            className={styles.image}
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.carouselItem}>
                                    <div className={styles.dashboardImage}>
                                        <img 
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/245822ebc38721ad8aa9fe194bb3bd2120eee998?width=2034"
                                            alt="Dashboard Interface"
                                            className={styles.image}
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.carouselItem}>
                                    <div className={styles.fieldsImage}>
                                        <img 
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/b869c325a91fbf264526570c8509d8c8680b24fb?width=2016"
                                            alt="Fields Dashboard"
                                            className={styles.image}
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.carouselItem}>
                                    <div className={styles.dashboardImage}>
                                        <img 
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/245822ebc38721ad8aa9fe194bb3bd2120eee998?width=2034"
                                            alt="Dashboard Interface"
                                            className={styles.image}
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.carouselItem}>
                                    <div className={styles.fieldsImage}>
                                        <img 
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/b869c325a91fbf264526570c8509d8c8680b24fb?width=2016"
                                            alt="Fields Dashboard"
                                            className={styles.image}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.gradientMask}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoTrial;
