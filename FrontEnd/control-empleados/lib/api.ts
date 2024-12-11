const API_URL = 'http://localhost:5192/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, { 
    ...options, 
    headers,
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  login: (username: string, password: string) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string, roleId: number) =>
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, roleId }),
    }),

  getEmployees: () => fetchWithAuth('/Empleado'),
  getGenders:()=>fetchWithAuth('/Empleado/genders'),
  getMaritalstatuses:()=>fetchWithAuth('/Empleado/maritalstatuses'),
  addEmployee: (employee: unknown) =>
    fetchWithAuth('/Empleado', {
      method: 'POST',
      body: JSON.stringify(employee),
    }),

    updateEmployee: (id: number, employee: unknown) => //Update here.  The type 'Empleado' is assumed to be defined elsewhere.
    fetchWithAuth(`/Empleado/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Employee-Id': id.toString(),
      },
      body: JSON.stringify(employee),
    }),

  deleteEmployee: (id: number) =>
    fetchWithAuth(`/Empleado/${id}`, {
      method: 'DELETE',
    }),

  getRoles: () => fetchWithAuth('/auth/roles'),
};