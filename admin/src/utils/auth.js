export const getToken = () => {
  return localStorage.getItem('admin_token');
};

export const setToken = (token) => {
  localStorage.setItem('admin_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('admin_token');
};

export const getUser = () => {
  const userStr = localStorage.getItem('admin_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  localStorage.setItem('admin_user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('admin_user');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/login';
};
