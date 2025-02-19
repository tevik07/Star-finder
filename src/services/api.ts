const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = {
  register: async (userData: { username: string; email: string; password: string }) => {
    try {
      console.log('Sending registration request to:', `${API_URL}/register`);
      console.log('With data:', JSON.stringify(userData));

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('Raw response:', text);
      
      if (!text) {
        throw new Error('Empty response from server');
      }

      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        return data;
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error(`Invalid server response: ${text}`);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Sending login request to:', `${API_URL}/login`);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
        mode: 'cors'
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Login failed');
        } catch (e) {
          throw new Error(`Server error: ${errorText}`);
        }
      }

      const text = await response.text();
      console.log('Raw response:', text);
      
      if (!text) {
        throw new Error('Empty response from server');
      }

      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  addToFavorites: async (token: string, itemType: 'star' | 'planet', itemData: { id: string; name: string; description: string }) => {
    const response = await fetch(`${API_URL}/favorites/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        itemType, 
        itemId: itemData.id,
        name: itemData.name,
        description: itemData.description
      })
    });
    return response.json();
  },

  getFavorites: async (token: string) => {
    const response = await fetch(`${API_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
}; 