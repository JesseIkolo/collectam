import React, { useState } from 'react';
import styles from './TeamSection.module.css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    dribbble?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Marcus Dutra",
    role: "Founder & CEO",
    description: "Leading Collectam to transform waste management with innovation.",
    image: "#FF6B6B",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      dribbble: "#"
    }
  },
  {
    id: 2,
    name: "Arthur Dutra",
    role: "UI & UX Designer",
    description: "Creating tech that powers sustainable waste solutions.",
    image: "#4ECDC4",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      dribbble: "#"
    }
  },
  {
    id: 3,
    name: "Manu Alentejo",
    role: "UX Designer",
    description: "Designing seamless solutions for waste collectors worldwide.",
    image: "#45B7D1",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      dribbble: "#"
    }
  },
  {
    id: 4,
    name: "Vycki Santos",
    role: "UX Designer",
    description: "Building intuitive tools for smarter waste management.",
    image: "#F7DC6F",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      dribbble: "#"
    }
  },
  {
    id: 5,
    name: "Sarah Johnson",
    role: "Data Scientist",
    description: "Optimizing collection routes with AI and machine learning.",
    image: "#BB8FCE",
    socialLinks: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 6,
    name: "Alex Chen",
    role: "IoT Engineer",
    description: "Developing smart sensors for waste container monitoring.",
    image: "#85C1E9",
    socialLinks: {
      linkedin: "#",
      dribbble: "#"
    }
  }
];

const TeamSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const membersPerPage = 3;
  const totalPages = Math.ceil(teamMembers.length / membersPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentMembers = () => {
    const start = currentIndex * membersPerPage;
    const end = start + membersPerPage;
    return teamMembers.slice(start, end);
  };

  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span>Team</span>
          </div>
          
          <div className={styles.headingContent}>
            <h2 className={styles.title}>
              We're a team of innovators and visionaries
            </h2>
            <p className={styles.description}>
              Our expertise fuels solutions for sustainable, efficient waste management
            </p>
          </div>
        </div>

        <div className={styles.teamCarousel}>
          <button 
            className={styles.navButton} 
            onClick={prevSlide}
            disabled={totalPages <= 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.teamGrid}>
            {getCurrentMembers().map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.colorContainer} style={{ backgroundColor: member.image }}></div>
                <div className={styles.memberInfo}>
                  <div className={styles.memberDetails}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberRole}>{member.role}</p>
                    <p className={styles.memberDescription}>{member.description}</p>
                  </div>
                  
                  <div className={styles.socialLinks}>
                    {member.socialLinks.twitter && (
                      <a href={member.socialLinks.twitter} className={styles.socialLink}>
                        <svg width="24" height="20" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.82617 1.2168H0.326172L9.17717 11.8068L0.808172 20.4468H3.64817L10.4922 13.3808L16.3982 20.4468H23.8982L14.6752 9.4108L22.6122 1.2168H19.7732L13.3592 7.8378L7.82617 1.2168ZM17.4692 18.5238L4.61217 3.1398H6.75517L19.6122 18.5238H17.4692Z" fill="#98A2B3"/>
                        </svg>
                      </a>
                    )}
                    {member.socialLinks.linkedin && (
                      <a href={member.socialLinks.linkedin} className={styles.socialLink}>
                        <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.3357 0.832031H1.88417C0.904492 0.832031 0.112305 1.60547 0.112305 2.56172V23.0976C0.112305 24.0539 0.904492 24.832 1.88417 24.832H22.3357C23.3154 24.832 24.1123 24.0539 24.1123 23.1023V2.56172C24.1123 1.60547 23.3154 0.832031 22.3357 0.832031ZM7.23261 21.2836H3.67011V9.82734H7.23261V21.2836ZM5.45136 8.26641C4.30761 8.26641 3.38418 7.34297 3.38418 6.2039C3.38418 5.06484 4.30761 4.1414 5.45136 4.1414C6.59043 4.1414 7.51386 5.06484 7.51386 6.2039C7.51386 7.33828 6.59043 8.26641 5.45136 8.26641ZM20.5639 21.2836H17.006V15.7148C17.006 14.3882 16.9826 12.6773 15.1545 12.6773C13.3029 12.6773 13.0217 14.1257 13.0217 15.6211V21.2836H9.46855V9.82734H12.881V11.3929H12.9279C13.4014 10.493 14.5639 9.54141 16.2936 9.54141C19.8982 9.54141 20.5639 11.9133 20.5639 14.9976V21.2836Z" fill="#98A2B3"/>
                        </svg>
                      </a>
                    )}
                    {member.socialLinks.dribbble && (
                      <a href={member.socialLinks.dribbble} className={styles.socialLink}>
                        <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12.1123 0.832031C5.48757 0.832031 0.112305 6.2073 0.112305 12.832C0.112305 19.4568 5.48757 24.832 12.1123 24.832C18.724 24.832 24.1123 19.4568 24.1123 12.832C24.1123 6.2073 18.724 0.832031 12.1123 0.832031ZM20.0385 6.36348C21.4702 8.10752 22.3293 10.3331 22.3553 12.7409C22.0169 12.6759 18.6329 11.986 15.2229 12.4155C15.1448 12.2463 15.0798 12.0641 15.0017 11.8819C14.7934 11.3874 14.5592 10.8797 14.3249 10.3982C18.0992 8.86243 19.8173 6.64982 20.0385 6.36348ZM12.1123 2.6021C14.7153 2.6021 17.0971 3.57824 18.9062 5.1791C18.724 5.43941 17.1752 7.50882 13.5309 8.87541C11.852 5.79081 9.99086 3.26587 9.7045 2.87541C10.4724 2.6932 11.2794 2.6021 12.1123 2.6021ZM7.75225 3.56522C8.02555 3.92964 9.84768 6.46761 11.5527 9.48711C6.76306 10.7626 2.53313 10.7366 2.07759 10.7366C2.74137 7.56088 4.88887 4.91879 7.75225 3.56522ZM1.85634 12.8451C1.85634 12.7409 1.85634 12.6368 1.85634 12.5327C2.29885 12.5456 7.27065 12.6107 12.3856 11.075C12.685 11.6476 12.9583 12.2333 13.2186 12.8189C13.0884 12.858 12.9452 12.8971 12.8151 12.9361C7.53095 14.6411 4.71968 19.3005 4.4854 19.691C2.8585 17.8819 1.85634 15.4741 1.85634 12.8451ZM12.1123 23.088C9.7435 23.088 7.55699 22.281 5.82597 20.9274C6.00818 20.55 8.09057 16.5414 13.8693 14.524C13.8953 14.511 13.9084 14.511 13.9344 14.498C15.3791 18.2333 15.9648 21.3699 16.121 22.268C14.8845 22.8016 13.5309 23.088 12.1123 23.088ZM17.8259 21.3309C17.7219 20.7062 17.1752 17.7127 15.8346 14.0294C19.0494 13.5218 21.8607 14.3548 22.2121 14.4719C21.7696 17.3222 20.1296 19.7821 17.8259 21.3309Z" fill="#98A2B3"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className={styles.navButton} 
            onClick={nextSlide}
            disabled={totalPages <= 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles.paginationDot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
