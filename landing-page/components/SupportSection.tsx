import React from 'react';
import { cn } from '../lib/utils';

interface ContactCard {
  title: string;
  description: string;
  contact: string;
  icon: string;
}

const SupportSection: React.FC = () => {
  const contactCards: ContactCard[] = [
    {
      title: "Chat to feedback",
      description: "Speak to our friendly team.",
      contact: "feedback@flora.com",
      icon: "💬"
    },
    {
      title: "Chat to support", 
      description: "We're here to help.",
      contact: "support@flora.com",
      icon: "🛠️"
    },
    {
      title: "Visit us",
      description: "Visit our office HQ.",
      contact: "Estr. dos Menezes, 850 - Alcântara, São Gonçalo",
      icon: "📍"
    },
    {
      title: "Call us",
      description: "Mon-Fri from 8am to 5pm.",
      contact: "+1 (407) 509-2169",
      icon: "📞"
    }
  ];

  return (
    <div className="flex flex-col items-center bg-white py-16 lg:py-20 px-4 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center gap-16 w-full">
          {/* Header Section */}
          <div className="flex flex-col items-center max-w-4xl">
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Badge */}
              <div className="flex justify-center items-center px-2 py-1 rounded-full bg-green-50 border border-green-100 mx-auto">
                <span className="text-green-600 font-medium text-sm leading-5 -tracking-wider">
                  Support
                </span>
              </div>

              {/* Heading and Supporting Text */}
              <div className="flex flex-col items-center gap-2 w-full text-center">
                <h2 className="text-black font-medium text-3xl lg:text-4xl xl:text-5xl leading-tight -tracking-wider">
                  We'd love to hear from you
                </h2>
                <p className="text-slate-600 text-lg leading-6 max-w-2xl">
                  Our friendly team is always here to chat.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {contactCards.map((card, index) => (
              <div 
                key={index} 
                className="flex flex-col items-start bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Featured Icon */}
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-16">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-start gap-5 w-full">
                  {/* Title and Description */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <h3 className="text-slate-900 font-medium text-lg leading-6 -tracking-wider">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-6">
                      {card.description}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="flex flex-col items-start w-full">
                    {card.title === "Visit us" ? (
                      <p className="text-green-600 font-medium text-base leading-6 -tracking-wider">
                        {card.contact}
                      </p>
                    ) : (
                      <a 
                        href={
                          card.title.includes("Chat") 
                            ? `mailto:${card.contact}` 
                            : card.title === "Call us" 
                            ? `tel:${card.contact}` 
                            : "#"
                        }
                        className="text-green-600 font-medium text-base leading-6 -tracking-wider hover:text-green-700 transition-colors duration-200"
                      >
                        {card.contact}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
