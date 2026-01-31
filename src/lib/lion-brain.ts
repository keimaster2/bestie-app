/**
 * Lion Brain: Affinity Tracker (G1)
 * Persistent client-side interest tracking using localStorage.
 */

export type InterestArea = "ai" | "culture" | "market" | "trend" | string;

const STORAGE_KEY = "bestie_lion_brain_affinity";

export const LionBrain = {
    /**
     * Get or create a persistent "Bestie ID" (Shadow Identity)
     */
    getBestieId(): string {
        if (typeof window === "undefined") return "";
        let id = localStorage.getItem("bestie_id");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("bestie_id", id);
            // Also set cookie for server-side visibility if needed later
            document.cookie = `bestie_id=${id}; path=/; max-age=31536000; SameSite=Lax`;
        }
        return id;
    },

    /**
     * Get current affinity scores
     */
    getAffinity(): Record<InterestArea, number> {
        if (typeof window === "undefined") return {};
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    },

    /**
     * Increase interest in a specific area
     */
    trackInterest(area: InterestArea, weight: number = 1) {
        if (typeof window === "undefined") return;
        const scores = this.getAffinity();
        scores[area] = (scores[area] || 0) + weight;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));

        // Dispatch custom event for real-time UI updates
        window.dispatchEvent(new CustomEvent('lion-brain-evolved', { detail: scores }));

        // Trigger generic sync (debouncing should ideally happen here or in logic)
        this.syncToShadowProfile();
    },

    /**
     * Sync local state to the "Shadow Profile" in the cloud (Mock/KV)
     */
    async syncToShadowProfile() {
        if (typeof window === "undefined") return;
        const id = this.getBestieId();
        const scores = this.getAffinity();

        try {
            // Fire and forget - don't block UI
            fetch('/api/lion-brain/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bestie_id: id, scores, timestamp: Date.now() })
            });
        } catch (e) {
            // Silently fail is okay for ambient sync
            console.error("LionBrain sync failed", e);
        }
    },

    /**
     * Get the top interest area
     */
    getPrimaryInterest(): InterestArea | null {
        const scores = this.getAffinity();
        const entries = Object.entries(scores);
        if (entries.length === 0) return null;
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }
};


