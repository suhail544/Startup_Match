/// <reference types="vite/client" />

import type {
  AuthResponse,
  User,
  Idea,
  Entrepreneur,
  Investor,
  SavedIdea,
  Interest,
} from "../types";

const BASE =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000/api";

const getToken = () =>
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

async function request(path: string, opts: RequestInit = {}) {
  const url = `${BASE}${path}`;

  console.log("REQUEST URL:", url);
  console.log("REQUEST OPTIONS:", opts);

  const res = await fetch(url, opts);

  console.log("RESPONSE STATUS:", res.status);

  const json = await res.json().catch(() => ({}));

  console.log("RESPONSE DATA:", json);

  if (!res.ok) {
    const message =
      json?.message || json?.error || res.statusText || "Request failed";

    throw new Error(message);
  }

  return json;
}

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const combineHeaders = (h: Record<string, string> = {}): Headers => {
  const out = new Headers();
  Object.entries({ ...h, ...authHeaders() }).forEach(([k, v]) => out.set(k, v));
  return out;
};

const mapIdeaStatusFromBackend = (status: any) => {
  if (!status) return "PUBLISHED";
  if (status === "ACTIVE") return "PUBLISHED";
  if (status === "CLOSED") return "FUNDED";
  return status;
};

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const json = await request("/auth/login", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email, password }),
    });
    return { token: json.token, user: json.data };
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    role: "ENTREPRENEUR" | "INVESTOR",
  ): Promise<AuthResponse> => {
    const json = await request("/auth/signup", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name, email, password, role }),
    });
    return { token: json.token, user: json.data };
  },
};

export const ideasAPI = {
  getAll: async (): Promise<Idea[]> => {
    const json = await request("/idea");
    return json.data.map((i: any) => ({
      ...i,
      status: mapIdeaStatusFromBackend(i.status),
    }));
  },

  getById: async (id: string): Promise<Idea> => {
    const json = await request(`/idea/${id}`);
    return { ...json.data, status: mapIdeaStatusFromBackend(json.data.status) };
  },

  getByEntrepreneur: async (entrepreneurId: string): Promise<Idea[]> => {
    const json = await request(`/idea`);
    return json.data
      .filter(
        (i: Idea) =>
          i.entrepreneur?.id === entrepreneurId ||
          i.entrepreneurId === entrepreneurId,
      )
      .map((i: any) => ({ ...i, status: mapIdeaStatusFromBackend(i.status) }));
  },

  create: async (data: Omit<Idea, "id" | "entrepreneur">): Promise<Idea> => {
    const payload = { ...data } as any;
    if (payload.status) {
      // Map frontend status to backend enum values
      if (payload.status === "PUBLISHED" || payload.status === "DRAFT")
        payload.status = "ACTIVE";
      if (payload.status === "FUNDED") payload.status = "CLOSED";
    }

    const json = await request("/idea", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return json.data;
  },

  update: async (id: string, data: Partial<Idea>): Promise<Idea> => {
    const payload = { ...data } as any;
    if (payload.status) {
      if (payload.status === "PUBLISHED" || payload.status === "DRAFT")
        payload.status = "ACTIVE";
      if (payload.status === "FUNDED") payload.status = "CLOSED";
    }

    const json = await request(`/idea/${id}`, {
      method: "PATCH",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    return json.data;
  },

  delete: async (id: string): Promise<void> => {
    await request(`/idea/${id}`, {
      method: "DELETE",
      headers: combineHeaders(),
    });
  },
};

export const entrepreneurAPI = {
  getByUserId: async (userId: string): Promise<Entrepreneur | null> => {
    try {
      const json = await request(`/entrepreneur/user/${userId}`, {
        headers: combineHeaders(),
      });
      return json.data;
    } catch (err) {
      return null;
    }
  },

  create: async (
    data: Omit<Entrepreneur, "id" | "user">,
  ): Promise<Entrepreneur> => {
    const json = await request("/entrepreneur", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return json.data;
  },

  update: async (
    id: string,
    data: Partial<Entrepreneur>,
  ): Promise<Entrepreneur> => {
    const json = await request(`/entrepreneur/${id}`, {
      method: "PUT",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return json.data;
  },
};

export const investorAPI = {
  getByUserId: async (userId: string): Promise<Investor | null> => {
    try {
      const json = await request(`/investor/user/${userId}`, {
        headers: combineHeaders(),
      });
      return json.data;
    } catch (err) {
      return null;
    }
  },

  create: async (data: Omit<Investor, "id" | "user">): Promise<Investor> => {
    const json = await request("/investor", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return json.data;
  },

  update: async (id: string, data: Partial<Investor>): Promise<Investor> => {
    const json = await request(`/investor/${id}`, {
      method: "PUT",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return json.data;
  },
};

export const savedIdeasAPI = {
  getByInvestor: async (_investorId?: string): Promise<SavedIdea[]> => {
    const json = await request("/save-idea", { headers: combineHeaders() });
    return json.data.map((item: any) => ({
      id: item.id,
      ideaId: item.idea.id,
      investorId: "",
      idea: {
        ...item.idea,
        status: mapIdeaStatusFromBackend(item.idea.status),
      },
    }));
  },

  save: async (ideaId: string): Promise<SavedIdea> => {
    const json = await request("/save-idea", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ ideaId }),
    });
    return json.data;
  },

  unsave: async (id: string): Promise<void> => {
    await request(`/save-idea/${id}`, {
      method: "DELETE",
      headers: combineHeaders(),
    });
  },
};

export const interestAPI = {
  getByInvestor: async (): Promise<Interest[]> => {
    const json = await request("/interest", { headers: combineHeaders() });
    return json.data;
  },

  getByIdea: async (ideaId: string): Promise<Interest[]> => {
    const json = await request(
      `/interest?ideaId=${encodeURIComponent(ideaId)}`,
    );
    return json.data;
  },

  create: async (data: Omit<Interest, "id" | "idea">): Promise<Interest> => {
    const json = await request("/interest", {
      method: "POST",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    return json.data;
  },

  updateStatus: async (
    id: string,
    status: "PENDING" | "ACCEPTED" | "REJECTED",
  ): Promise<Interest> => {
    const json = await request(`/interest/${id}`, {
      method: "PATCH",
      headers: combineHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ status }),
    });
    return json.data;
  },
};
