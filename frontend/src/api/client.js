// API Client with hybrid Live / Simulation Mode support
import * as mockData from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('cti_auth_token') || null;
    this.user = JSON.parse(localStorage.getItem('cti_auth_user') || 'null');
    // Default to true for simulation if no backend connection exists
    this.simulationMode = localStorage.getItem('cti_sim_mode') !== 'false';
  }

  setToken(token, user = null) {
    this.token = token;
    if (token) {
      localStorage.setItem('cti_auth_token', token);
    } else {
      localStorage.removeItem('cti_auth_token');
    }
    if (user) {
      this.user = user;
      localStorage.setItem('cti_auth_user', JSON.stringify(user));
    } else {
      this.user = null;
      localStorage.removeItem('cti_auth_user');
    }
  }

  setSimulationMode(enabled) {
    this.simulationMode = enabled;
    localStorage.setItem('cti_sim_mode', enabled ? 'true' : 'false');
  }

  async request(endpoint, options = {}) {
    if (this.simulationMode) {
      return this.handleMockRequest(endpoint, options);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error ${response.status}`);
      }

      return data.data !== undefined ? data.data : data;
    } catch (err) {
      console.warn(`[API] Request to ${endpoint} failed, falling back to simulated data:`, err.message);
      return this.handleMockRequest(endpoint, options);
    }
  }

  // Handle fallback mock responses
  handleMockRequest(endpoint, options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.startsWith('/threat-reports')) {
          if (options.method === 'POST') {
            const body = JSON.parse(options.body || '{}');
            const newReport = {
              id: `rep-${Date.now().toString().slice(-4)}`,
              title: body.title || 'Untitled Threat Report',
              status: body.status || 'NEW',
              source: { name: body.sourceName || 'Tor Darknet Feed', type: 'ONION' },
              category: { name: body.categoryName || 'General Threat' },
              analyst: { name: this.user?.name || 'Lead Threat Analyst', email: this.user?.email || 'analyst@cti.io' },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              description: body.description || '',
              indicators: body.indicators || [],
              malware: [],
              alerts: [{ message: 'Simulated alert logged for threat evaluation', level: 'INFO' }],
              recommendations: body.recommendation ? [{ text: body.recommendation }] : []
            };
            mockData.mockThreatReports.unshift(newReport);
            resolve(newReport);
            return;
          }
          resolve(mockData.mockThreatReports);
          return;
        }

        if (endpoint.startsWith('/threat-indicators')) {
          resolve(mockData.mockThreatIndicators);
          return;
        }

        if (endpoint.startsWith('/hacker-groups')) {
          resolve(mockData.mockHackerGroups);
          return;
        }

        if (endpoint.startsWith('/data-leaks')) {
          resolve(mockData.mockDataLeaks);
          return;
        }

        if (endpoint.startsWith('/incidents')) {
          if (options.method === 'PUT') {
            const id = endpoint.split('/')[2];
            const body = JSON.parse(options.body || '{}');
            const inc = mockData.mockIncidents.find(i => i.id === id);
            if (inc && body.status) inc.status = body.status;
            resolve(inc || {});
            return;
          }
          resolve(mockData.mockIncidents);
          return;
        }

        if (endpoint.startsWith('/investigations')) {
          resolve(mockData.mockInvestigations);
          return;
        }

        if (endpoint.startsWith('/malware')) {
          resolve(mockData.mockMalwareList);
          return;
        }

        if (endpoint.startsWith('/audit-logs')) {
          resolve(mockData.mockAuditLogs);
          return;
        }

        if (endpoint.startsWith('/access-logs')) {
          resolve(mockData.mockAccessLogs);
          return;
        }

        if (endpoint.startsWith('/auth/')) {
          const isAnalyst = endpoint.includes('analyst');
          const mockUser = {
            id: 'mock-user-1',
            name: isAnalyst ? 'Elena Rostova' : 'System Administrator',
            email: isAnalyst ? 'analyst@cyberthreat.io' : 'admin@cyberthreat.io',
            role: isAnalyst ? 'ANALYST' : 'ADMIN'
          };
          resolve({ token: 'mock-jwt-token-xyz-123', user: mockUser });
          return;
        }

        resolve({});
      }, 150);
    });
  }

  // Domain API Methods
  async getReports() {
    return this.request('/threat-reports');
  }

  async createReport(payload) {
    return this.request('/threat-reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getIndicators() {
    return this.request('/threat-indicators');
  }

  async getHackerGroups() {
    return this.request('/hacker-groups');
  }

  async getDataLeaks() {
    return this.request('/data-leaks');
  }

  async getIncidents() {
    return this.request('/incidents');
  }

  async updateIncidentStatus(id, status) {
    return this.request(`/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async getInvestigations() {
    return this.request('/investigations');
  }

  async getMalware() {
    return this.request('/malware');
  }

  async getAuditLogs() {
    return this.request('/audit-logs');
  }

  async getAccessLogs() {
    return this.request('/access-logs');
  }

  async login(type, email, password) {
    const endpoint = `/auth/${type}/login`;
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async checkBackendHealth() {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        return data.status === 'OK';
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();
