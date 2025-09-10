import React from 'react';
import { cn } from '../lib/utils';

interface Location {
  city: string;
  address: string;
}

const LocationsSection: React.FC = () => {
  const locations: Location[] = [
    {
      city: "Rio de Janeiro",
      address: "R. Jangadeiros, 48 - Ipanema, Rio de Janeiro - RJ, 22420-010"
    },
    {
      city: "Itaboraí", 
      address: "Rod. Governador Mário Covas, KM295 - Três Pontes, Itaboraí - RJ, 24809-234"
    },
    {
      city: "Saquarema",
      address: "R. Dr. Luiz Januário, 262 - Centro, Saquarema - RJ, 28990-000"
    },
    {
      city: "São Gonçalo",
      address: "Estr. dos Menezes, 850 - Alcântara, São Gonçalo"
    },
    {
      city: "Niterói",
      address: "Av. Visconde do Rio Branco, 563 - 22° Andar, Sala 2206"
    },
    {
      city: "Maricá",
      address: "R. Abreu Rangel - Eldorado, Maricá - RJ, 24900-000"
    }
  ];

  return (
    <div className="flex flex-col items-center bg-gray-50 py-16 lg:py-20 px-4 lg:px-0">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-16 py-8 px-8">
          {/* Left Content - Header */}
          <div className="flex flex-col items-start gap-8 lg:w-80">
            {/* Badge */}
            <div className="flex justify-center items-center px-2 py-1 rounded-full bg-green-50 border border-green-100">
              <span className="text-green-600 font-medium text-sm leading-5 -tracking-wider">
                Our Locations
              </span>
            </div>

            {/* Heading and Supporting Text */}
            <div className="flex flex-col items-start gap-2 w-full">
              <h2 className="text-black font-medium text-4xl lg:text-5xl leading-tight -tracking-wider">
                Visit our<br />offices
              </h2>
              <p className="text-slate-600 text-lg leading-6 w-full">
                Find us at these locations.
              </p>
            </div>
          </div>

          {/* Right Content - Locations Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl">
              {locations.map((location, index) => (
                <div key={index} className="flex flex-col items-start gap-2">
                  <h3 className="text-black font-medium text-2xl leading-8 -tracking-wider">
                    {location.city}
                  </h3>
                  <p className="text-slate-600 text-base leading-6 max-w-sm">
                    {location.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsSection;
