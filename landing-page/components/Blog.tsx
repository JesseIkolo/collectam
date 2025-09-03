import React from 'react';
import styles from './Blog.module.css';

const Blog: React.FC = () => {
    return (
        <div className={styles.blog}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <span>Blog</span>
                    </div>
                    
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            Our latest regenerative news
                        </h2>
                        
                        <p className={styles.description}>
                            We play a vital role in promoting regenerative practices, not only in<br />
                            agriculture but also in restoring balance to our ecosystems.
                        </p>
                    </div>
                    
                    <button className={styles.ctaButton}>
                        Open Blog
                    </button>
                </div>
                
                <div className={styles.articles}>
                    {/* Article 1 - Agroforestry */}
                    <article className={styles.articleCard}>
                        <div className={styles.articleImage}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/00873b56397f56838f8335a4cb202ccd162caad3?width=1116"
                                alt="A tractor working on a small farm with wooden structures and trees in the background."
                                className={styles.image}
                            />
                        </div>
                        
                        <div className={styles.articleMeta}>
                            <div className={styles.tagSection}>
                                <div className={styles.tag + ' ' + styles.agroforestryTag}>
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.833 5.275V6.775C14.833 7.80934 14.4221 8.80132 13.6907 9.53272C12.9593 10.2641 11.9674 10.675 10.933 10.675H9.43301V13.675H8.23301V9.475L8.24501 8.875C8.32057 7.89558 8.76296 6.98074 9.48376 6.31333C10.2046 5.64593 11.1507 5.27511 12.133 5.275H14.833ZM5.23301 2.875C6.11489 2.87478 6.97449 3.15203 7.69006 3.66748C8.40562 4.18293 8.94088 4.91046 9.22001 5.747C8.76077 6.13595 8.38449 6.61332 8.11356 7.15071C7.84264 7.68809 7.68261 8.27449 7.64301 8.875H7.03301C5.9191 8.875 4.85081 8.4325 4.06316 7.64485C3.27551 6.8572 2.83301 5.78891 2.83301 4.675V2.875H5.23301Z" fill="#1FC16B"/>
                                    </svg>
                                    <span>Agroforestry</span>
                                </div>
                                
                                <span className={styles.separator}>•</span>
                                <span className={styles.date}>Dec 22, 2024</span>
                            </div>
                            
                            <div className={styles.articleContent}>
                                <h3 className={styles.articleTitle}>
                                    Agroforestry in Small Farms
                                </h3>
                                
                                <p className={styles.articleDescription}>
                                    Step-by-step guide for farmers to implement agroforestry<br />
                                    systems in smaller areas.
                                </p>
                            </div>
                        </div>
                    </article>
                    
                    {/* Article 2 - Biodiversity */}
                    <article className={styles.articleCard}>
                        <div className={styles.articleImage}>
                            <img 
                                src="https://api.builder.io/api/v1/image/assets/TEMP/1359fbba1caede5dcefe379c780ef20a40879747?width=1116"
                                alt="A tractor working on a small farm with wooden structures and trees in the background."
                                className={styles.image}
                            />
                        </div>
                        
                        <div className={styles.articleMeta}>
                            <div className={styles.tagSection}>
                                <div className={styles.tag + ' ' + styles.biodiversityTag}>
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.875 5.46387C11.875 5.61087 11.865 5.75587 11.847 5.89887C13.376 6.75687 13.993 8.64287 13.267 10.2389C12.541 11.8349 10.714 12.6089 9.063 12.0209V13.9009H7.938V11.8759C6.599 12.5599 4.962 12.1829 4.058 10.9819C3.153 9.78087 3.244 8.10287 4.271 7.00587C4.494 7.61387 4.842 8.16087 5.286 8.61287L6.09 7.82487C5.471 7.19487 5.124 6.34687 5.125 5.46387C5.125 3.59987 6.636 2.08887 8.5 2.08887C10.364 2.08887 11.875 3.59987 11.875 5.46387Z" fill="#F6B51F"/>
                                    </svg>
                                    <span>Biodiversity</span>
                                </div>
                                
                                <span className={styles.separator}>•</span>
                                <span className={styles.date}>Nov 19, 2024</span>
                            </div>
                            
                            <div className={styles.articleContent}>
                                <h3 className={styles.articleTitle}>
                                    Building Resilient Soil Systems
                                </h3>
                                
                                <p className={styles.articleDescription}>
                                    Dive into regenerative farming techniques to restore soil health<br />
                                    and boost sustainability.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Blog;
