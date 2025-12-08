import { Vector3 } from 'three';

export type ToolType = 'SELECT' | 'RAKE' | 'SMOOTH' | 'ROCK' | 'BONSAI' | 'CHERRY_BLOSSOM' | 'BRIDGE' | 'PAGODA' | 'POND' | 'DELETE';

export type ItemCategory = 'rock' | 'bonsai' | 'cherry' | 'bridge' | 'pagoda' | 'pond';

export interface Selection {
    id: string;
    type: ItemCategory;
}

export interface RockData {
  id: string;
  position: [number, number, number];
  scale: number;
  rotation: number;
  type: number; // 0, 1, or 2 for different rock shapes
}

export interface BonsaiData {
  id: string;
  position: [number, number, number];
  scale: number;
  rotation: number;
  type: number; // For variant styles
}

export interface GenericItemData {
  id: string;
  position: [number, number, number];
  scale: number;
  rotation: number;
}

export type CherryBlossomData = GenericItemData;
export type BridgeData = GenericItemData;
export type PagodaData = GenericItemData;
export type PondData = GenericItemData;

export interface SoundState {
  wind: number;
  rain: number;
  bowls: number;
  whiteNoise: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

// Gemini Types
export interface GeminiConfig {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
}