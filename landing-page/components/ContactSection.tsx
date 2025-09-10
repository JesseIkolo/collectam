import React, { useState } from 'react';
import styles from './ContactSection.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  userType: string;
  agreeToPolicy: boolean;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
    userType: '',
    agreeToPolicy: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      agreeToPolicy: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          message: formData.message,
          userType: formData.userType
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Merci ! Vous avez été ajouté à notre liste d\'attente.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: '',
          userType: '',
          agreeToPolicy: false
        });
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <section className={styles.contactSection} id="waitlist">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span>Contact us</span>
          </div>
          
          <div className={styles.headingContent}>
            <h2 className={styles.title}>Rejoindre la waitinglist</h2>
            <p className={styles.description}>
              Inscrivez-vous à notre liste d'attente pour être parmi les premiers à découvrir Collectam.
            </p>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First Name
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jane"
                    className={styles.input}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last Name
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Smith"
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane@flora.com"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+33 1 23 45 67 89"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="userType" className={styles.label}>
                Type d'utilisateur
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Sélectionnez votre profil</option>
                  <option value="menage">Ménage - Particulier</option>
                  <option value="collecteur">Collecteur - Professionnel</option>
                  <option value="collectam-business">Collectam Business</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <div className={styles.textareaWrapper}>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Leave us a message..."
                  className={styles.textarea}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="agreeToPolicy"
                  name="agreeToPolicy"
                  checked={formData.agreeToPolicy}
                  onChange={handleCheckboxChange}
                  className={styles.checkbox}
                  required
                />
                <div className={styles.checkboxCustom}></div>
              </div>
              <label htmlFor="agreeToPolicy" className={styles.checkboxLabel}>
                You agree to our friendly{' '}
                <a href="/privacy-policy" className={styles.privacyLink}>
                  privacy policy.
                </a>
              </label>
            </div>

            <button type="submit" className={styles.submitButton}>
              Rejoindre la waitinglist
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
