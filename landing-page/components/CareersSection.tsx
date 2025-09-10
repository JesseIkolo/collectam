import React from 'react';
import styles from './CareersSection.module.css';

interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  type: string;
  salary: string;
}

const jobPositions: JobPosition[] = [
  {
    id: 1,
    title: "Product Designer",
    department: "Design",
    location: "Rio de Janeiro, BR",
    description: "Shape the future of regenerative farming with user-centered designs.",
    type: "Full-time",
    salary: "$70k - $80k"
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "Rio de Janeiro, BR",
    description: "Design intuitive interfaces that empower farmers globally",
    type: "Full-time",
    salary: "$80k - $100k"
  },
  {
    id: 3,
    title: "Engineering Manager",
    department: "Software",
    location: "Rio de Janeiro, BR",
    description: "Lead the development of innovative solutions for sustainable agriculture.",
    type: "Full-time",
    salary: "$120k - $180k"
  },
  {
    id: 4,
    title: "Frontend Developer",
    department: "Software",
    location: "Rio de Janeiro, BR",
    description: "Build tools that make farming smarter and more efficient.",
    type: "Full-time",
    salary: "$85k - $110k"
  },
  {
    id: 5,
    title: "Backend Developer",
    department: "Software",
    location: "Rio de Janeiro, BR",
    description: "Develop robust systems to support the future of agrotechnology.",
    type: "Full-time",
    salary: "$100k - $110k"
  },
  {
    id: 6,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Rio de Janeiro, BR",
    description: "Help farmers thrive by ensuring they get the most out of our platform.",
    type: "Full-time",
    salary: "$90k - $120k"
  }
];

const CareersSection: React.FC = () => {
  const departments = [
    {
      name: "Design",
      description: "Open positions in our design team.",
      jobs: jobPositions.filter(job => job.department === "Design")
    },
    {
      name: "Software Development",
      description: "Open positions in our software team.",
      jobs: jobPositions.filter(job => job.department === "Software")
    },
    {
      name: "Customer Success",
      description: "Open positions in our CX team.",
      jobs: jobPositions.filter(job => job.department === "Customer Success")
    }
  ];

  return (
    <section className={styles.careersSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span>Jobs</span>
          </div>
          
          <div className={styles.headingContent}>
            <h2 className={styles.title}>
              Transform Agriculture, Empower Farmers
            </h2>
            <p className={styles.description}>
              Join our mission to revolutionize farming with technology that nurtures the land and supports sustainable growth.
            </p>
          </div>
        </div>

        <div className={styles.divider}>
          <svg width="1137" height="4" viewBox="0 0 1137 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1135.18 2.10645H1.04492V1.10645H1135.18V2.10645Z" fill="#E0FAEC"/>
          </svg>
        </div>

        {departments.map((department, deptIndex) => (
          <div key={department.name} className={styles.departmentSection}>
            <div className={styles.departmentInfo}>
              <h3 className={styles.departmentTitle}>{department.name}</h3>
              <p className={styles.departmentDescription}>{department.description}</p>
            </div>
            
            <div className={styles.jobsGrid}>
              {department.jobs.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <div className={styles.jobTitleRow}>
                      <h4 className={styles.jobTitle}>{job.title}</h4>
                      <div className={styles.badges}>
                        <div className={styles.departmentBadge}>
                          <div className={styles.dot}></div>
                          <span>{job.department}</span>
                        </div>
                        <div className={styles.locationBadge}>
                          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.1123 12.1064C2.7985 12.1064 0.112305 9.42025 0.112305 6.10645C0.112305 2.79265 2.7985 0.106445 6.1123 0.106445C9.4261 0.106445 12.1123 2.79265 12.1123 6.10645C12.1123 9.42025 9.4261 12.1064 6.1123 12.1064ZM4.7383 10.7066C4.14635 9.45103 3.80342 8.09258 3.7285 6.70645H1.3495C1.46625 7.62979 1.84865 8.49934 2.45024 9.20947C3.05183 9.91959 3.84671 10.4397 4.7383 10.7066ZM4.9303 6.70645C5.0209 8.16985 5.4391 9.54445 6.1123 10.7576C6.80369 9.51238 7.20757 8.12814 7.2943 6.70645H4.9303ZM10.8751 6.70645H8.4961C8.42118 8.09258 8.07825 9.45103 7.4863 10.7066C8.37789 10.4397 9.17277 9.91959 9.77436 9.20947C10.3759 8.49934 10.7583 7.62979 10.8751 6.70645ZM1.3495 5.50645H3.7285C3.80342 4.12032 4.14635 2.76186 4.7383 1.50625C3.84671 1.77318 3.05183 2.2933 2.45024 3.00343C1.84865 3.71355 1.46625 4.58311 1.3495 5.50645ZM4.9309 5.50645H7.2937C7.20715 4.08481 6.80348 2.70057 6.1123 1.45525C5.42091 2.70052 5.01763 4.08476 4.9309 5.50645ZM7.4863 1.50625C8.07825 2.76186 8.42118 4.12032 8.4961 5.50645H10.8751C10.7583 4.58311 10.3759 3.71355 9.77436 3.00343C9.17277 2.2933 8.37789 1.77318 7.4863 1.50625Z" fill="#525866"/>
                          </svg>
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className={styles.jobDescription}>{job.description}</p>
                  </div>
                  
                  <div className={styles.jobDetails}>
                    <div className={styles.jobDetail}>
                      <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.1123 15.9014C3.9703 15.9014 0.612305 12.5434 0.612305 8.40137C0.612305 4.25937 3.9703 0.901367 8.1123 0.901367C12.2543 0.901367 15.6123 4.25937 15.6123 8.40137C15.6123 12.5434 12.2543 15.9014 8.1123 15.9014ZM8.1123 14.4014C9.7033 14.4014 11.2293 13.7694 12.3553 12.6444C13.4803 11.5184 14.1123 9.99237 14.1123 8.40137C14.1123 6.81037 13.4803 5.28437 12.3553 4.15837C11.2293 3.03337 9.7033 2.40137 8.1123 2.40137C6.5213 2.40137 4.9953 3.03337 3.8693 4.15837C2.7443 5.28437 2.1123 6.81037 2.1123 8.40137C2.1123 9.99237 2.7443 11.5184 3.8693 12.6444C4.9953 13.7694 6.5213 14.4014 8.1123 14.4014ZM8.8623 8.40137H11.8623V9.90137H7.3623V4.65137H8.8623V8.40137Z" fill="#525866"/>
                      </svg>
                      <span>{job.type}</span>
                    </div>
                    <div className={styles.jobDetail}>
                      <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.1123 15.9014C3.9703 15.9014 0.612305 12.5434 0.612305 8.40137C0.612305 4.25937 3.9703 0.901367 8.1123 0.901367C12.2543 0.901367 15.6123 4.25937 15.6123 8.40137C15.6123 12.5434 12.2543 15.9014 8.1123 15.9014ZM8.1123 14.4014C9.7033 14.4014 11.2293 13.7694 12.3553 12.6444C13.4803 11.5184 14.1123 9.99237 14.1123 8.40137C14.1123 6.81037 13.4803 5.28437 12.3553 4.15837C11.2293 3.03337 9.7033 2.40137 8.1123 2.40137C6.5213 2.40137 4.9953 3.03337 3.8693 4.15837C2.7443 5.28437 2.1123 6.81037 2.1123 8.40137C2.1123 9.99237 2.7443 11.5184 3.8693 12.6444C4.9953 13.7694 6.5213 14.4014 8.1123 14.4014ZM5.4873 9.90137H9.6123C9.7113 9.90137 9.80731 9.86137 9.87731 9.79137C9.9473 9.72137 9.9873 9.62537 9.9873 9.52637C9.9873 9.42737 9.9473 9.33137 9.87731 9.26137C9.80731 9.19137 9.7113 9.15137 9.6123 9.15137H6.6123C6.1153 9.15137 5.6383 8.95337 5.2863 8.60237C4.9353 8.25037 4.7373 7.77337 4.7373 7.27637C4.7373 6.77937 4.9353 6.30237 5.2863 5.95037C5.6383 5.59937 6.1153 5.40137 6.6123 5.40137H7.3623V3.90137H8.8623V5.40137H10.7373V6.90137H6.6123C6.5133 6.90137 6.4173 6.94137 6.3473 7.01137C6.2773 7.08137 6.2373 7.17737 6.2373 7.27637C6.2373 7.37537 6.2773 7.47137 6.3473 7.54137C6.4173 7.61137 6.5133 7.65137 6.6123 7.65137H9.6123C10.1093 7.65137 10.5863 7.84937 10.9383 8.20037C11.2903 8.55237 11.4873 9.02937 11.4873 9.52637C11.4873 10.0234 11.2903 10.5004 10.9383 10.8524C10.5863 11.2044 10.1093 11.4014 9.6123 11.4014H8.8623V12.9014H7.3623V11.4014H5.4873V9.90137Z" fill="#525866"/>
                      </svg>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {deptIndex < departments.length - 1 && (
              <div className={styles.divider}>
                <svg width="1137" height="4" viewBox="0 0 1137 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1135.18 2.10645H1.04492V1.10645H1135.18V2.10645Z" fill="#E0FAEC"/>
                </svg>
              </div>
            )}
          </div>
        ))}

        <div className={styles.officeImage}>
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/6a192cb2469ab6055a1a0acd9ce6dffa5fcd6854?width=2272" 
            alt="Our office workspace"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
