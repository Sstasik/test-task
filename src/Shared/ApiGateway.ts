import { API_BASE } from "./config";

export interface ApiResponse {
  status?: string;
  [key: string]: any;
}

export default class ApiGateway {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`);
    const dto = await response.json();
    return dto as T;
  }

  async post<T>(path: string, payload: any): Promise<T | null> {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dto = await response.json();
    return dto as T;
  }
}