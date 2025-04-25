
import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import DoctorList from "../components/DoctorList";
import { Doctor, FilterState } from "../types/doctor";
import { 
  filterDoctors, 
  sortDoctors, 
  extractSpecialties, 
  parseUrlParams, 
  updateUrlParams 
} from "../utils/helpers";

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(parseUrlParams());

  // Extract unique specialties from doctor data
  const specialties = useMemo(() => {
    return extractSpecialties(doctors);
  }, [doctors]);

  // Filter and sort doctors based on current filters
  const filteredDoctors = useMemo(() => {
    const filtered = filterDoctors(doctors, filters);
    return sortDoctors(filtered, filters.sort);
  }, [doctors, filters]);

  // Fetch doctors data on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.status}`);
        }
        
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle URL changes (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setFilters(parseUrlParams());
    };

    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams(filters);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search changes
  const handleSearchChange = (search: string) => {
    handleFilterChange("q", search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-medical-700 text-white py-6 shadow-md">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Find a Doctor</h1>
          <p className="mt-2 text-medical-100">Search for specialists in your area</p>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <SearchBar 
              doctors={doctors} 
              searchTerm={filters.q} 
              onSearchChange={handleSearchChange} 
            />
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <FilterPanel 
                  filters={filters}
                  specialties={specialties}
                  onFilterChange={handleFilterChange}
                />
              </div>
              
              <div className="md:w-3/4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    {!loading && (
                      <span className="text-gray-600">
                        {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
                      </span>
                    )}
                  </div>
                  
                  {Object.values(filters).some(val => 
                    Array.isArray(val) ? val.length > 0 : Boolean(val)
                  ) && (
                    <button
                      onClick={() => {
                        setFilters({
                          q: "",
                          consultation: "",
                          specialties: [],
                          sort: "",
                        });
                      }}
                      className="text-sm text-medical-600 hover:text-medical-800"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
                
                <DoctorList doctors={filteredDoctors} loading={loading} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
