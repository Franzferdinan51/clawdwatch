import axios from 'axios';

/**
 * Ship Tracking Source
 * Uses free AIS data sources for vessel monitoring
 */

export interface Ship {
  mmsi: string;
  name: string;
  callsign: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  heading: number;
  destination: string;
  eta: string;
  status: string;
  timestamp: number;
}

export interface ShipAlert {
  type: 'military' | 'dark' | 'anomaly' | 'tanker';
  ship: Ship;
  message: string;
  timestamp: Date;
}

// Ship type codes (AIS)
const MILITARY_TYPES = ['35', '55']; // Military, Law Enforcement
const TANKER_TYPES = ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89'];

export class ShipTracker {
  private lastShips: Map<string, Ship> = new Map();
  private alerts: ShipAlert[] = [];
  private darkShips: Set<string> = new Set(); // Ships that went dark

  /**
   * Fetch ships from AISHub or similar free source
   * Note: Most free AIS APIs require registration
   */
  async fetchShips(bounds?: { latMin: number; latMax: number; lonMin: number; lonMax: number }): Promise<Ship[]> {
    // Using a free sample endpoint - in production you'd use AISHub, MarineTraffic, etc.
    try {
      // This is a placeholder - real implementation would hit actual AIS API
      // For demo purposes, we'll return empty until configured
      console.log('Ship tracking: Configure MARINE_TRAFFIC_API_KEY for live data');
      return [];
    } catch (error: any) {
      console.error('Ship fetch error:', error.message);
      return [];
    }
  }

  /**
   * Check if ship is military/government
   */
  isMilitary(ship: Ship): boolean {
    return MILITARY_TYPES.includes(ship.type);
  }

  /**
   * Check if ship is a tanker
   */
  isTanker(ship: Ship): boolean {
    return TANKER_TYPES.includes(ship.type);
  }

  /**
   * Detect ships that went dark (AIS off)
   */
  detectDarkShips(currentShips: Ship[]): ShipAlert[] {
    const alerts: ShipAlert[] = [];
    const currentMmsis = new Set(currentShips.map(s => s.mmsi));

    // Check for ships that were tracked but disappeared
    for (const [mmsi, lastShip] of this.lastShips) {
      if (!currentMmsis.has(mmsi) && !this.darkShips.has(mmsi)) {
        // Ship went dark
        this.darkShips.add(mmsi);
        alerts.push({
          type: 'dark',
          ship: lastShip,
          message: `Ship went dark: ${lastShip.name || mmsi} last seen at ${lastShip.latitude.toFixed(4)}, ${lastShip.longitude.toFixed(4)}`,
          timestamp: new Date(),
        });
      }
    }

    // Update tracking
    for (const ship of currentShips) {
      this.lastShips.set(ship.mmsi, ship);
      this.darkShips.delete(ship.mmsi); // Back online
    }

    return alerts;
  }

  /**
   * Analyze ships and generate alerts
   */
  analyze(ships: Ship[]): ShipAlert[] {
    const newAlerts: ShipAlert[] = [];

    // Detect dark ships
    newAlerts.push(...this.detectDarkShips(ships));

    // Check for military vessels
    for (const ship of ships) {
      if (this.isMilitary(ship)) {
        const existing = Array.from(this.lastShips.values()).find(s => s.mmsi === ship.mmsi);
        if (!existing) {
          newAlerts.push({
            type: 'military',
            ship,
            message: `Military vessel detected: ${ship.name || ship.mmsi}`,
            timestamp: new Date(),
          });
        }
      }
    }

    this.alerts = [...this.alerts, ...newAlerts].slice(-100);
    return newAlerts;
  }

  /**
   * Get ships in strategic waterways
   */
  async getStrategicWaters(region: 'strait_hormuz' | 'suez' | 'gulf_oman' | 'red_sea' | 'persian_gulf'): Promise<Ship[]> {
    const bounds = {
      strait_hormuz: { latMin: 25.5, latMax: 27, lonMin: 55.5, lonMax: 57.5 },
      suez: { latMin: 29.5, latMax: 31.5, lonMin: 32, lonMax: 34 },
      gulf_oman: { latMin: 22, latMax: 26.5, lonMin: 56, lonMax: 62 },
      red_sea: { latMin: 12, latMax: 30, lonMin: 32, lonMax: 44 },
      persian_gulf: { latMin: 24, latMax: 30, lonMin: 48, lonMax: 56 },
    };

    return this.fetchShips(bounds[region]);
  }

  getAlerts(): ShipAlert[] {
    return this.alerts;
  }
}

export const shipTracker = new ShipTracker();
