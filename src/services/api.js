const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong while contacting the server.";

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getCareerPaths(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.set("keyword", params.keyword);
  }

  if (typeof params.featured === "boolean") {
    searchParams.set("featured", params.featured);
  }

  const query = searchParams.toString();
  return request(`/career-paths${query ? `?${query}` : ""}`);
}

export function registerStudent(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginStudent(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerAdmin(payload) {
  return request("/admin-auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginAdmin(payload) {
  return request("/admin-auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createCareerPath(payload) {
  return request("/career-paths", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getResources(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.careerPathId) {
    searchParams.set("careerPathId", params.careerPathId);
  }

  const query = searchParams.toString();
  return request(`/resources${query ? `?${query}` : ""}`);
}

export function createResource(payload) {
  return request("/resources", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCounsellors(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.specialization) {
    searchParams.set("specialization", params.specialization);
  }

  const query = searchParams.toString();
  return request(`/counsellors${query ? `?${query}` : ""}`);
}

export function createCounsellor(payload) {
  return request("/counsellors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getSessions(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  return request(`/sessions${query ? `?${query}` : ""}`);
}

export function bookSession(payload) {
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSessionStatus(sessionId, status) {
  return request(`/sessions/${sessionId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getDashboardStats() {
  return request("/dashboard/stats");
}

export function getStudents() {
  return request("/admin/students");
}
