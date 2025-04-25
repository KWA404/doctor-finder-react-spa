
import React from "react";
import { ConsultationType, FilterState, SortOption } from "../types/doctor";

interface FilterPanelProps {
  filters: FilterState;
  specialties: string[];
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  specialties,
  onFilterChange,
}) => {
  const handleConsultationChange = (value: ConsultationType) => {
    onFilterChange("consultation", value);
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const updatedSpecialties = checked
      ? [...filters.specialties, specialty]
      : filters.specialties.filter((s) => s !== specialty);
    
    onFilterChange("specialties", updatedSpecialties);
  };

  const handleSortChange = (value: SortOption) => {
    onFilterChange("sort", value);
  };

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="filter-group">
        <h3 className="filter-header" data-testid="filter-header-moc">
          Consultation Type
        </h3>
        <div className="space-y-2">
          <label className="radio-container">
            <input
              type="radio"
              name="consultation"
              checked={filters.consultation === "video_consult"}
              onChange={() => handleConsultationChange("video_consult")}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label className="radio-container">
            <input
              type="radio"
              name="consultation"
              checked={filters.consultation === "in_clinic"}
              onChange={() => handleConsultationChange("in_clinic")}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
          {filters.consultation && (
            <button
              onClick={() => handleConsultationChange("")}
              className="text-sm text-medical-600 hover:text-medical-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-header" data-testid="filter-header-speciality">
          Specialties
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {specialties.map((specialty) => (
            <label
              key={specialty}
              className="checkbox-container"
            >
              <input
                type="checkbox"
                checked={filters.specialties.includes(specialty)}
                onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                data-testid={`filter-specialty-${specialty.replace(/\s+/g, "-")}`}
              />
              {specialty}
            </label>
          ))}
          {filters.specialties.length > 0 && (
            <button
              onClick={() => onFilterChange("specialties", [])}
              className="text-sm text-medical-600 hover:text-medical-800"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-header" data-testid="filter-header-sort">
          Sort By
        </h3>
        <div className="space-y-2">
          <label className="radio-container">
            <input
              type="radio"
              name="sort"
              checked={filters.sort === "fees"}
              onChange={() => handleSortChange("fees")}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label className="radio-container">
            <input
              type="radio"
              name="sort"
              checked={filters.sort === "experience"}
              onChange={() => handleSortChange("experience")}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
          {filters.sort && (
            <button
              onClick={() => handleSortChange("")}
              className="text-sm text-medical-600 hover:text-medical-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
