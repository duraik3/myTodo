const API_BASE_URL = 'http://localhost:8080/api'; // Adjust if your backend runs elsewhere
import type { Todo } from '../types/todo';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

export const addTodo = async (task: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
  if (!response.ok) { throw new Error('Failed to add todo'); }
  return response.json();
};

export const updateTodo = async (id: string, updates: Partial<Pick<Todo, 'task' | 'completed'>>): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) { throw new Error('Failed to update todo'); }
    return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete todo');
  }
};

// --- ✨ Gemini API Service ---
export const callGeminiAPI = async (prompt: string): Promise<string> => {
    const apiKey = "AIzaSyCEYzTy0QrICdZLHcnVgtRujblLMKyYPt8"; // The API key is handled by the environment.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Gemini API Error Response:", errorBody);
            throw new Error(`Gemini API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected Gemini API response structure:", result);
            throw new Error('Failed to get a valid response from Gemini API.');
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};