
import React from "react";
import { Doctor } from "../types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      data-testid="doctor-card"
    >
      <div className="flex gap-4">
        <div className="h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
          {doctor.photo ? (
            <img 
              src={doctor.photo} 
              alt={doctor.name} 
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=" + doctor.name_initials;
              }}
            />
          ) : (
            <div className="h-full w-full bg-medical-200 flex items-center justify-center text-lg font-medium">
              {doctor.name_initials}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-lg text-medical-900" data-testid="doctor-name">
            {doctor.name}
          </h3>
          
          <div className="space-y-1 mt-1">
            <p className="text-sm text-gray-600" data-testid="doctor-specialty">
              {doctor.specialities.map(s => s.name).join(", ")}
            </p>
            
            <p className="text-sm" data-testid="doctor-experience">
              {doctor.experience}
            </p>
            
            <p className="font-medium text-medical-700" data-testid="doctor-fee">
              {doctor.fees}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {doctor.video_consult && (
          <span className="px-2 py-1 bg-medical-100 text-medical-700 rounded text-xs font-medium">
            Video Consult
          </span>
        )}
        
        {doctor.in_clinic && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            In Clinic
          </span>
        )}
        
        {doctor.languages.length > 0 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {doctor.languages.slice(0, 2).join(", ")}
            {doctor.languages.length > 2 && "..."}
          </span>
        )}
      </div>
      
      {doctor.clinic.address.locality && (
        <div className="mt-2 text-xs text-gray-500">
          {doctor.clinic.name}, {doctor.clinic.address.locality}
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
