import React from 'react';
import Image from 'next/image';
import styles from './Partners.module.css';

const Partners: React.FC = () => {
    const partners = [
        {
            logo: '/logo-hysacam.jpg',
            name: 'HYSACAM',
            alt: 'Logo HYSACAM'
        },
        {
            logo: '/logo-mairie-douala-3.png',
            name: 'Mairie Douala 3',
            alt: 'Logo Mairie Douala 3'
        },
        {
            logo: '/logo-mairie-douala-5.png',
            name: 'Mairie Douala 5',
            alt: 'Logo Mairie Douala 5'
        },
        {
            logo: '/logo-communaute-urbaine-de-douala-1.png',
            name: 'Communauté Urbaine de Douala',
            alt: 'Logo Communauté Urbaine de Douala'
        },
        {
            logo: '/logo-mairie-douala-4.jpg',
            name: 'Mairie Douala 4',
            alt: 'Logo Mairie Douala 4'
        }
    ];

    return (
        <div id="partners" className={styles.partners}>
            <div className={styles.partnersContainer}>
                {partners.map((partner, index) => (
                    <div key={index} className={styles.partnerItem}>
                        <div className={styles.logoContainer}>
                            <Image
                                src={partner.logo}
                                alt={partner.alt}
                                width={150}
                                height={100}
                                className={styles.partnerLogo}
                                quality={95}
                            />
                        </div>
                        <p className={styles.partnerName}>
                            {partner.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Partners;
