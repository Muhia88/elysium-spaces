import { create } from 'zustand';

export interface RoomObject {
  id: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number]; // Strictly [0, y, 0] for furniture
}

export type TransformMode = 'translate' | 'rotate';

interface RoomState {
  objects: RoomObject[];
  selectedObjectId: string | null;
  transformMode: TransformMode;
  cameraPosition: [number, number]; // [x, z] for minimap
  addObject: (obj: RoomObject) => void;
  updateObject: (id: string, updates: Partial<RoomObject>) => void;
  removeObject: (id: string) => void;
  setSelectedObject: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  setCameraPosition: (pos: [number, number]) => void;
  loadState: (objects: RoomObject[]) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  objects: [],
  selectedObjectId: null,
  transformMode: 'translate',
  cameraPosition: [0, 8],
  
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  
  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map((obj) => obj.id === id ? { ...obj, ...updates } : obj)
  })),
  
  removeObject: (id) => set((state) => ({
    objects: state.objects.filter((obj) => obj.id !== id),
    selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
  })),
  
  setSelectedObject: (id) => set({ selectedObjectId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  
  loadState: (objects) => set({ objects, selectedObjectId: null }),
}));
