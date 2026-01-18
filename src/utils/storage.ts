import { Model, IJsonModel } from 'flexlayout-react';

const STORAGE_KEY = 'mosaic_ide_layout';
const VERSION_KEY = 'mosaic_ide_version';
const CURRENT_VERSION = '1.0.0';

export const saveLayoutToStorage = (model: Model) => {
  try {
    const json = model.toJson();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch (error) {
    console.warn('Failed to save layout to storage:', error);
  }
};

export const loadLayoutFromStorage = (defaultLayout: IJsonModel): Model => {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData && savedVersion === CURRENT_VERSION) {
      const json = JSON.parse(savedData);
      return Model.fromJson(json);
    }
  } catch (error) {
    console.warn('Failed to load layout from storage, using default:', error);
  }
  
  return Model.fromJson(defaultLayout);
};

export const clearLayoutStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERSION_KEY);
};
