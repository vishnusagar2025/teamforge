import api from "./api";

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
};

export const teamService = {
  getTeams: (filters = {}) => api.get("/teams/", { params: filters }),
  getTeam: (id) => api.get(`/teams/${id}`),
  createTeam: (data) => api.post("/teams/", data),
  requestToJoin: (teamId) => api.post(`/teams/${teamId}/join`),
  acceptMember: (teamId, memberId) => api.post(`/teams/${teamId}/accept/${memberId}`),
};

export const searchService = {
  searchUsers: (filters = {}) => api.get("/search/users", { params: filters }),
  searchTeams: (filters = {}) => api.get("/search/teams", { params: filters }),
};

export const profileService = {
  getMyProfile: () => api.get("/profile/"),
  updateProfile: (data) => api.put("/profile/", data),
  addSkill: (data) => api.post("/profile/skills", data),
  deleteSkill: (id) => api.delete(`/profile/skills/${id}`),
  addInterest: (data) => api.post("/profile/interests", data),
  deleteInterest: (id) => api.delete(`/profile/interests/${id}`),
  getUserProfile: (id) => api.get(`/profile/${id}`),
};

export const notificationService = {
  getNotifications: () => api.get("/notifications/"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

export const projectService = {
  getProjects: () => api.get("/projects/"),
  createProject: (data) => api.post("/projects/", data),
  getProject: (id) => api.get(`/projects/${id}`),
};
