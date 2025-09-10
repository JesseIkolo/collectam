import React, { useState } from 'react';
import { cn } from '../lib/utils';

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
    userType: '',
    agreeToPolicy: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
    <div className="flex justify-center items-center min-h-screen bg-white px-4 lg:px-0">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-end gap-16 py-32 px-8">
          {/* Left Content */}
          <div className="flex flex-col items-start gap-12 flex-1 max-w-xl">
            {/* Header Section */}
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Badge */}
              <div className="flex justify-center items-center px-2 py-1 rounded-full bg-green-50 border border-green-100">
                <span className="text-green-600 font-medium text-sm leading-5 -tracking-wider">
                  Contact Us
                </span>
              </div>

              {/* Heading and Supporting Text */}
              <div className="flex flex-col justify-center items-start gap-2 w-full">
                <h1 className="text-black font-medium text-4xl lg:text-5xl leading-tight -tracking-wider">
                  Rejoindre la waitinglist
                </h1>
                <p className="text-slate-600 text-lg leading-6 w-full">
                  Inscrivez-vous à notre liste d'attente pour être parmi les premiers à découvrir Collectam.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-start gap-5 w-full min-w-full">
              {/* First Name and Last Name Row */}
              <div className="flex justify-center items-center gap-8 w-full flex-col sm:flex-row">
                <div className="flex flex-col items-start gap-2.5 flex-1 w-full">
                  <label className="text-slate-600 font-medium text-sm leading-5 -tracking-wider">
                    First Name
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className="w-full h-10 px-3 py-2.5 border border-slate-300 rounded-lg text-gray-500 text-base leading-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col items-start gap-2.5 flex-1 w-full">
                  <label className="text-slate-600 font-medium text-sm leading-5 -tracking-wider">
                    Last Name
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Smith"
                      className="w-full h-10 px-3 py-2.5 border border-slate-300 rounded-lg text-gray-500 text-base leading-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <label className="text-slate-600 font-medium text-sm leading-5 -tracking-wider">
                  Email
                </label>
                <div className="relative w-full">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@flora.com"
                    className="w-full h-10 px-3 py-2.5 border border-slate-300 rounded-lg text-gray-500 text-base leading-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <label className="text-slate-600 font-medium text-sm leading-5 -tracking-wider">
                  Phone Number
                </label>
                <div className="relative w-full">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+33 1 23 45 67 89"
                    className="w-full h-10 px-3 py-2.5 border border-slate-300 rounded-lg text-gray-500 text-base leading-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* User Type */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <label className="text-slate-600 font-medium text-sm leading-5 -tracking-wider">
                  Type d'utilisateur
                </label>
                <div className="relative w-full">
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 py-2.5 border border-slate-300 rounded-lg text-gray-500 text-base leading-normal focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez votre profil</option>
                    <option value="menage">Ménage - Particulier</option>
                    <option value="collecteur">Collecteur - Professionnel</option>
                    <option value="collectam-business">Collectam Business</option>
                    <option value="entreprise">Entreprise</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <label className="text-slate-600 font-medium text-sm leading-5 -tracking-wider">
                  Message
                </label>
                <div className="relative w-full">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Leave us a message..."
                    rows={4}
                    className="w-full min-h-[100px] px-3 py-2.5 border border-slate-300 rounded-lg text-gray-500 text-base leading-normal placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-center gap-2.5 w-full">
                <input
                  type="checkbox"
                  name="agreeToPolicy"
                  checked={formData.agreeToPolicy}
                  onChange={handleInputChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300"
                />
                <div className="flex justify-center items-start">
                  <span className="text-slate-600 text-sm font-medium leading-5 -tracking-wider">
                    You agree to our friendly{' '}
                    <a href="#" className="text-slate-600 underline">
                      privacy policy.
                    </a>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col justify-center items-start w-full">
                <button
                  type="submit"
                  className="flex justify-center items-center w-full h-10 px-2.5 rounded-lg bg-gradient-to-b from-green-400 to-green-600 shadow-lg border border-green-600 text-white text-lg font-medium leading-6 -tracking-wider hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Rejoindre la waitinglist
                </button>
              </div>
            </form>
          </div>

          {/* Right Content - Map */}
          <div className="flex flex-col justify-center items-start flex-1 w-full max-w-xl">
            <div className="flex flex-col justify-center items-start w-full h-full bg-gray-500 rounded-lg overflow-hidden">
              <div className="flex flex-col justify-center items-center w-full h-[698px] bg-orange-100 relative">
                {/* Google Maps Embedded */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8944444444444!2d-43.00635!3d-22.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ5JzMwLjAiUyA0M8KwMDAnMzguMiJX!5e0!3m2!1sen!2sbr!4v1642000000000!5m2!1sen!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
                
                {/* Map Info Overlay */}
                <div className="absolute top-2.5 left-2.5 w-80 h-auto">
                  <div className="flex flex-col items-start p-2.5 bg-white rounded-sm shadow-lg border border-gray-200">
                    <div className="flex flex-col items-start gap-1.5 w-full">
                      <h3 className="text-black font-medium text-sm leading-normal">
                        22°49'30.0"S 43°00'38.2"W
                      </h3>
                      <p className="text-gray-600 text-xs leading-normal">
                        5XFQ+XQR São Gonçalo, State of Rio de Janeiro, Brazil
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <button className="flex flex-col items-center gap-1.5 p-1.5">
                        <div className="w-5.5 h-5.5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6L6 2L10 6L6 10L2 6Z" fill="white"/>
                          </svg>
                        </div>
                        <span className="text-blue-600 text-xs leading-normal">Directions</span>
                      </button>
                    </div>
                    <div className="flex items-start mt-2.5">
                      <a href="#" className="text-blue-600 text-xs leading-normal">
                        View larger map
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Logo */}
                <div className="absolute bottom-4 right-16">
                  <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/829d7227cca914858bee052f0f2124a843188126?width=52" 
                    alt="Google" 
                    className="w-13 h-5.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormSection;
