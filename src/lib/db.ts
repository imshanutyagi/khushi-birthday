import { PageContent, Gift, UserSelection } from './types';

// Content Management
export const getPageContent = async (): Promise<PageContent | null> => {
  try {
    const response = await fetch('/api/content');
    const result = await response.json();

    if (result.success) {
      return { id: result.data._id, ...result.data };
    }
    return null;
  } catch (error) {
    console.error('Error getting page content:', error);
    return null;
  }
};

export const updatePageContent = async (content: Partial<PageContent>): Promise<void> => {
  try {
    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to save content');
    }
  } catch (error) {
    console.error('Error updating page content:', error);
    throw error;
  }
};

export const initializeDefaultContent = async (): Promise<void> => {
  // This is now handled automatically by the API
  await getPageContent();
};

// Gift Management
export const getGifts = async (): Promise<Gift[]> => {
  try {
    const response = await fetch('/api/gifts');
    const result = await response.json();

    if (result.success) {
      return result.data.map((gift: any) => ({
        id: gift._id,
        title: gift.title,
        description: gift.description,
        images: gift.images,
        enabled: gift.enabled,
        order: gift.order,
        isCustomText: gift.isCustomText,
        customText: gift.customText,
        showInSelection: gift.showInSelection,
        showInLuckGame: gift.showInLuckGame,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting gifts:', error);
    return [];
  }
};

export const getGift = async (id: string): Promise<Gift | null> => {
  try {
    const gifts = await getGifts();
    return gifts.find(g => g.id === id) || null;
  } catch (error) {
    console.error('Error getting gift:', error);
    return null;
  }
};

export const addGift = async (gift: Omit<Gift, 'id'>): Promise<string> => {
  try {
    const response = await fetch('/api/gifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gift),
    });

    const result = await response.json();
    if (result.success) {
      return result.data._id;
    }
    throw new Error('Failed to add gift');
  } catch (error) {
    console.error('Error adding gift:', error);
    throw error;
  }
};

export const updateGift = async (id: string, gift: Partial<Gift>): Promise<void> => {
  try {
    const response = await fetch('/api/gifts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...gift }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update gift failed:', errorData);
      throw new Error(errorData.error || 'Failed to update gift');
    }

    const data = await response.json();
    console.log('Gift updated successfully:', data);
  } catch (error) {
    console.error('Error updating gift:', error);
    throw error;
  }
};

export const deleteGift = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/gifts?id=${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting gift:', error);
    throw error;
  }
};

// User Selections
export const saveUserSelection = async (selection: Omit<UserSelection, 'id'>): Promise<void> => {
  try {
    await fetch('/api/selections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selection),
    });
  } catch (error) {
    console.error('Error saving selection:', error);
    throw error;
  }
};

export const getUserSelections = async (): Promise<UserSelection[]> => {
  try {
    const response = await fetch('/api/selections');
    const result = await response.json();

    if (result.success) {
      return result.data.map((selection: any) => ({
        id: selection._id,
        selectedGiftId: selection.selectedGiftId,
        customText: selection.customText,
        openedGiftIds: selection.openedGiftIds,
        timestamp: selection.timestamp,
        userAgent: selection.userAgent,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting selections:', error);
    return [];
  }
};

export const deleteUserSelection = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/selections?id=${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting selection:', error);
    throw error;
  }
};

// File Upload
export const uploadFile = async (file: File, folder: string = 'media'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.url;
    }
    throw new Error('Failed to upload file');
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (url: string): Promise<void> => {
  // Cloudinary delete can be implemented if needed
  console.log('File deletion not implemented for Cloudinary');
};
