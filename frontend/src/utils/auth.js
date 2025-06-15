export const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

// API Check
const checkResponse = (response) => {  
  return response.json()  
    .then((data) => {  
      if (response.ok) {  
        return data;  
      }  
      return Promise.reject(data || `Error: ${response.status}`);  
    });  
};

// New uSER
export const register = async (email, password) => {  
  const response = await fetch(`${BASE_URL}/signup`, {  
    method: 'POST',  
    headers: {  
      'Accept': 'application/json',  
      'Content-Type': 'application/json'  
    },  
    body: JSON.stringify({ email, password })  
  });  
  return checkResponse(response);  
};

// Autorização para login
export const authorize = async (email, password) => {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return checkResponse(response);
};

// Verificação de Token
export const checkToken = async (token) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return checkResponse(response);
};