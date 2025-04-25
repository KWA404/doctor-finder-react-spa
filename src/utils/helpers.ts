
import { Doctor, FilterState, SortOption } from "../types/doctor";

// Parse experience string to number (years)
export const parseExperience = (experienceString: string): number => {
  const match = experienceString.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Parse fees string to number
export const parseFees = (feesString: string): number => {
  const match = feesString.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Filter doctors based on filter state
export const filterDoctors = (doctors: Doctor[], filters: FilterState): Doctor[] => {
  return doctors.filter((doctor) => {
    // Filter by search query
    if (filters.q && !doctor.name.toLowerCase().includes(filters.q.toLowerCase())) {
      return false;
    }

    // Filter by consultation type
    if (filters.consultation === "video_consult" && !doctor.video_consult) {
      return false;
    }
    if (filters.consultation === "in_clinic" && !doctor.in_clinic) {
      return false;
    }

    // Filter by specialties
    if (
      filters.specialties.length > 0 &&
      !doctor.specialities.some((specialty) =>
        filters.specialties.includes(specialty.name)
      )
    ) {
      return false;
    }

    return true;
  });
};

// Sort doctors based on sort option
export const sortDoctors = (doctors: Doctor[], sortOption: SortOption): Doctor[] => {
  if (!sortOption) return doctors;

  return [...doctors].sort((a, b) => {
    if (sortOption === "fees") {
      return parseFees(a.fees) - parseFees(b.fees);
    }
    if (sortOption === "experience") {
      return parseExperience(b.experience) - parseExperience(a.experience);
    }
    return 0;
  });
};

// Extract unique specialties from doctors
export const extractSpecialties = (doctors: Doctor[]): string[] => {
  const specialtiesSet = new Set<string>();
  doctors.forEach((doctor) => {
    doctor.specialities.forEach((specialty) => {
      specialtiesSet.add(specialty.name);
    });
  });
  return Array.from(specialtiesSet).sort();
};

// Parse URL query parameters
export const parseUrlParams = (): FilterState => {
  const params = new URLSearchParams(window.location.search);
  
  return {
    q: params.get("q") || "",
    consultation: (params.get("consultation") as any) || "",
    specialties: params.get("specialties") ? params.get("specialties")!.split(",") : [],
    sort: (params.get("sort") as SortOption) || "",
  };
};

// Update URL query parameters
export const updateUrlParams = (filters: FilterState): void => {
  const params = new URLSearchParams();
  
  if (filters.q) {
    params.set("q", filters.q);
  }
  
  if (filters.consultation) {
    params.set("consultation", filters.consultation);
  }
  
  if (filters.specialties.length > 0) {
    params.set("specialties", filters.specialties.join(","));
  }
  
  if (filters.sort) {
    params.set("sort", filters.sort);
  }
  
  const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
};

// Debounce function
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};
