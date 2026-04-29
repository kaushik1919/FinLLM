'use client'

import { create } from 'zustand'

// ─── Panel registry ────────────────────────────────────────────────────────────
// Add future workspace panels here: 'agent-trace' | 'chart' | 'portfolio'
export type WorkspacePanel = 'source' | 'none'

interface UiState {
  // ── Sidebar ──────────────────────────────────────────────────────────────────
  sidebarOpen: boolean

  // ── Right workspace panel ─────────────────────────────────────────────────────
  activePanel: WorkspacePanel

  // ── Actions ───────────────────────────────────────────────────────────────────
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  openPanel: (panel: WorkspacePanel) => void
  closePanel: () => void
  togglePanel: (panel: WorkspacePanel) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: true,
  activePanel: 'none',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: 'none' }),
  togglePanel: (panel) =>
    set({ activePanel: get().activePanel === panel ? 'none' : panel }),
}))

// ─── Selectors ─────────────────────────────────────────────────────────────────
// Use these in components to subscribe to the minimal slice needed,
// preventing re-renders when unrelated UI state changes.

export const selectSidebarOpen = (s: UiState) => s.sidebarOpen
export const selectActivePanel = (s: UiState) => s.activePanel
export const selectSourcePanelOpen = (s: UiState) => s.activePanel === 'source'
