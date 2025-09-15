import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.backgroundContainer}>
                <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/2b94a47de06b84c04abf55d2a4c73a6c2ef3364b?width=3840"
                    alt="Lake with mountains and pine trees"
                    className={styles.backgroundImage}
                />
                <div className={styles.fadeOverlay}></div>
            </div>
            
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.brandSection}>
                        <div className={styles.logoContainer}>
                            <div className={styles.logo}>
                                <div className={styles.logoIcon}></div>
                            </div>
                            <h3 className={styles.brandName}>Collectam™</h3>
                        </div>
                        
                        <blockquote className={styles.quote}>
                            "Transformons ensemble la gestion<br />
                            des déchets pour un avenir<br />
                            plus durable et responsable."
                        </blockquote>
                        
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_30_2309)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M15.4275 0.946289H2.57253C1.55791 0.946289 0.736115 1.72484 0.736115 2.68605V14.8645C0.736115 15.8257 1.55791 16.6042 2.57253 16.6042H15.4275C16.4421 16.6042 17.2639 15.8257 17.2639 14.8645V2.68605C17.2639 1.72484 16.4421 0.946289 15.4275 0.946289ZM5.73347 14.4294H3.26808V6.88977H5.73347V14.4294ZM4.4893 5.90245C3.68357 5.90245 3.03164 5.28048 3.03164 4.51063C3.03164 3.74078 3.68357 3.11882 4.4893 3.11882C5.29502 3.11882 5.94695 3.74078 5.94695 4.51063C5.94695 5.28048 5.29502 5.90245 4.4893 5.90245ZM14.9683 14.4294H12.5167V10.4715C12.5167 9.38634 12.0806 8.77959 11.1762 8.77959C10.1891 8.77959 9.67488 9.41023 9.67488 10.4715V14.4294H7.3105V6.88977H9.67488V7.90536C9.67488 7.90536 10.3865 6.65925 12.0737 6.65925C13.7609 6.65925 14.9707 7.63569 14.9707 9.65602V14.4294H14.9683Z" fill="#0D111B"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_2309">
                                            <rect width="17" height="17" fill="white" transform="translate(0.5 0.275391)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                            
                            <a href="#" className={styles.socialLink}>
                                <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_30_1915)">
                                        <path d="M5 0.505859H0.625L5.78804 6.86038L0.906219 12.0442H2.56249L6.55519 7.80452L10 12.0443H14.375L8.99481 5.42257L13.6251 0.505859H11.9688L8.22769 4.47842L5 0.505859ZM10.625 10.8905L3.125 1.65971H4.375L11.875 10.8905H10.625Z" fill="#0D111B"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_1915">
                                            <rect width="14" height="12" fill="white" transform="translate(0.5 0.275391)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                            
                            <a href="#" className={styles.socialLink}>
                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_30_3005)">
                                        <path d="M8 0.275391C9.91044 0.275391 10.1488 0.282391 10.8983 0.317391C11.6472 0.352391 12.1569 0.469291 12.6055 0.642891C13.0695 0.820691 13.4605 1.06149 13.8514 1.44999C14.209 1.79992 14.4856 2.2232 14.6622 2.69039C14.8358 3.13629 14.9539 3.64449 14.9891 4.38999C15.0222 5.13619 15.0312 5.37349 15.0312 7.27539C15.0312 9.17729 15.0242 9.41459 14.9891 10.1608C14.9539 10.9063 14.8358 11.4138 14.6622 11.8604C14.4861 12.3278 14.2093 12.7513 13.8514 13.1008C13.4998 13.4566 13.0747 13.732 12.6055 13.9079C12.1575 14.0808 11.6472 14.1984 10.8983 14.2334C10.1488 14.2663 9.91044 14.2754 8 14.2754C6.08961 14.2754 5.85125 14.2684 5.10172 14.2334C4.35289 14.1984 3.84313 14.0808 3.39453 13.9079C2.92507 13.7326 2.49983 13.457 2.14859 13.1008C1.79098 12.7509 1.51433 12.3276 1.33789 11.8604C1.16352 11.4144 1.04609 10.9063 1.01094 10.1608C0.977891 9.41459 0.96875 9.17729 0.96875 7.27539C0.96875 5.37349 0.975781 5.13619 1.01094 4.38999C1.04609 3.64379 1.16352 3.13699 1.33789 2.69039C1.51384 2.22291 1.79056 1.79951 2.14859 1.44999C2.49992 1.09385 2.92514 0.818401 3.39453 0.642891C3.84313 0.469291 4.35219 0.352391 5.10172 0.317391C5.85125 0.284491 6.08961 0.275391 8 0.275391ZM8 3.77539C7.0676 3.77539 6.17338 4.14414 5.51408 4.80052C4.85477 5.45689 4.48438 6.34713 4.48438 7.27539C4.48438 8.20365 4.85477 9.09389 5.51408 9.75031C6.17338 10.4066 7.0676 10.7754 8 10.7754C8.9324 10.7754 9.82662 10.4066 10.486 9.75031C11.1452 9.09389 11.5156 8.20365 11.5156 7.27539C11.5156 6.34713 11.1452 5.45689 10.486 4.80052C9.82662 4.14414 8.9324 3.77539 8 3.77539ZM12.5703 3.60039C12.5703 3.36833 12.4777 3.14576 12.3129 2.98167C12.1481 2.81758 11.9245 2.72539 11.6914 2.72539C11.4583 2.72539 11.2347 2.81758 11.0699 2.98167C10.9051 3.14576 10.8125 3.36833 10.8125 3.60039C10.8125 3.83245 10.9051 4.05502 11.0699 4.21911C11.2347 4.38321 11.4583 4.47539 11.6914 4.47539C11.9245 4.47539 12.1481 4.38321 12.3129 4.21911C12.4777 4.05502 12.5703 3.83245 12.5703 3.60039ZM8 5.17539C8.55944 5.17539 9.09597 5.39664 9.49155 5.79047C9.88709 6.1843 10.1094 6.71843 10.1094 7.27539C10.1094 7.83235 9.88709 8.36649 9.49155 8.76031C9.09597 9.15414 8.55944 9.37539 8 9.37539C7.44056 9.37539 6.90403 9.15414 6.50845 8.76031C6.11286 8.36649 5.89062 7.83235 5.89062 7.27539C5.89062 6.71843 6.11286 6.1843 6.50845 5.79047C6.90403 5.39664 7.44056 5.17539 8 5.17539Z" fill="#0D111B"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_3005">
                                            <rect width="15" height="14" fill="white" transform="translate(0.5 0.275391)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                            
                            <a href="#" className={styles.socialLink}>
                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_30_2039)">
                                        <path d="M8.29167 4.10896V8.29432C8.29167 10.3654 6.62442 12.0443 4.56771 12.0443C2.51102 12.0443 0.84375 10.3654 0.84375 8.29432C0.84375 6.22322 2.51102 4.54432 4.56771 4.54432C4.86351 4.54432 5.15122 4.57905 5.42708 4.64467V6.4694C5.16664 6.34478 4.87525 6.27509 4.56771 6.27509C3.46027 6.27509 2.5625 7.17912 2.5625 8.29432C2.5625 9.40952 3.46027 10.3136 4.56771 10.3136C5.67516 10.3136 6.57292 9.40952 6.57292 8.29432V0.505859H8.29167C8.29167 2.09899 9.5742 3.39047 11.1562 3.39047V5.12124C10.0724 5.12124 9.07633 4.74237 8.29167 4.10896Z" fill="#0D111B"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_2039">
                                            <rect width="11" height="12" fill="white" transform="translate(0.5 0.275391)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div className={styles.linksSection}>
                        <div className={styles.linkColumn}>
                            <h4 className={styles.columnTitle}>HOME</h4>
                            <ul className={styles.linksList}>
                                <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a></li>
                                <li><a href="#usertypes" onClick={(e) => { e.preventDefault(); document.getElementById('usertypes')?.scrollIntoView({ behavior: 'smooth' }); }}>Types d'utilisateurs</a></li>
                            </ul>
                        </div>
                        
                        
                        <div className={styles.linkColumn}>
                            <h4 className={styles.columnTitle}>ABOUT US</h4>
                            <ul className={styles.linksList}>
                                <li><a href="/about#team">Team</a></li>
                                <li><a href="/about#jobs">Jobs</a></li>
                                <li><a href="/about#mission">Notre Mission</a></li>
                            </ul>
                        </div>
                        
                        <div className={styles.linkColumn}>
                            <h4 className={styles.columnTitle}>CONTACT US</h4>
                            <ul className={styles.linksList}>
                                <li><a href="/contact">Contact Us</a></li>
                                <li><a href="/contact#offices">Nos Bureaux</a></li>
                                <li><a href="/contact#support">Support</a></li>
                            </ul>
                        </div>
                        
                        <div className={styles.linkColumn}>
                            <h4 className={styles.columnTitle}>RESOURCES</h4>
                            <ul className={styles.linksList}>
                                <li><a href="#blog">Blog</a></li>
                                <li><a href="#cookies">Cookies Policy</a></li>
                                <li><a href="#privacy">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className={styles.bottomSection}>
                    <div className={styles.copyright}>
                        Collectam © 2025. Tous droits réservés
                    </div>
                    <div className={styles.credits}>
                        <a href="#" className={styles.creditsLink}>Développé avec ❤️ pour l'environnement</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
