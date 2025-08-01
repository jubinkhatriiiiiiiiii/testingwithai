export interface Resource {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: string;
  description: string;
  url: string;
  tags: string[];
  dateAdded: string;
  featured: boolean;
}

export interface UserNote {
  resourceId: string;
  notes: string;
  lastUpdated: string;
}

// Favorites management
export const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem("Eduvault-favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
};

export const addToFavorites = (resourceId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(resourceId)) {
    favorites.push(resourceId);
    localStorage.setItem("Eduvault-favorites", JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (resourceId: string): void => {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== resourceId);
  localStorage.setItem("Eduvault-favorites", JSON.stringify(updated));
};

export const isFavorite = (resourceId: string): boolean => {
  return getFavorites().includes(resourceId);
};

// Recently viewed management
export const getRecentlyViewed = (): string[] => {
  try {
    const recent = localStorage.getItem("Eduvault-recent");
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
};

export const addToRecentlyViewed = (resourceId: string): void => {
  let recent = getRecentlyViewed();
  recent = recent.filter((id) => id !== resourceId); // Remove if already exists
  recent.unshift(resourceId); // Add to beginning
  recent = recent.slice(0, 10); // Keep only last 10
  localStorage.setItem("Eduvault-recent", JSON.stringify(recent));
};

export const clearRecentlyViewed = (): void => {
  localStorage.removeItem("Eduvault-recent");
};

// Notes management
export const getUserNotes = (resourceId: string): string => {
  try {
    const notes = localStorage.getItem("Eduvault-notes");
    const notesObj = notes ? JSON.parse(notes) : {};
    return notesObj[resourceId]?.notes || "";
  } catch {
    return "";
  }
};

export const saveUserNotes = (resourceId: string, notes: string): void => {
  try {
    const existingNotes = localStorage.getItem("Eduvault-notes");
    const notesObj = existingNotes ? JSON.parse(existingNotes) : {};
    notesObj[resourceId] = {
      notes,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("Eduvault-notes", JSON.stringify(notesObj));
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
};

// Resources loading (🔁 cache-busting only)
export const loadResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetch(`/resources.json?v=${Date.now()}`);
    const data = await response.json();
    return data.resources || [];
  } catch (error) {
    console.error("Failed to load resources:", error);
    return [];
  }
};
