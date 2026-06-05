// userManagement.js
import { getStorageData, setStorageData } from './schooldata.js';

const STORAGE_KEY = 'users';

/**
 * Fetch all registered system users from LocalStorage
 * @returns {Array} List of users
 */
export const getAllUsers = () => {
  return getStorageData(STORAGE_KEY);
};

/**
 * Find a specific user details by ID
 * @param {string} id - The user ID (e.g., 'USR-001')
 * @returns {Object|null} The user object or null if not found
 */
export const getUserById = (id) => {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
};

/**
 * Create and save a new user record with a unique ID
 * @param {Object} userData - Form data containing name, email, role, etc.
 * @returns {Object} The newly created user object
 */
export const createUser = (userData) => {
  const users = getAllUsers();
  
  // Generate a custom unique tracking ID (e.g., USR-482)
  const uniqueId = `USR-${Date.now().toString().slice(-3)}${Math.floor(Math.random() * 10)}`;

  const newUser = {
    id: uniqueId,
    name: userData.name || "New User",
    email: userData.email || "",
    role: userData.role || "Teacher",
    status: userData.status || "Active",
    department: userData.department || "General",
  };

  users.push(newUser);
  setStorageData(STORAGE_KEY, users);
  return newUser;
};

/**
 * Edit fields of an existing system user
 * @param {string} id - Target user ID
 * @param {Object} updatedFields - Fields to change
 * @returns {Object|null} Updated user or null if failed
 */
export const updateUser = (id, updatedFields) => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    // Keep original ID, overwrite everything else with updated changes
    users[index] = { ...users[index], ...updatedFields, id };
    setStorageData(STORAGE_KEY, users);
    return users[index];
  }
  return null;
};

/**
 * Delete a user from registration records
 * @param {string} id - Target user ID
 * @returns {boolean} True if deleted successfully, false otherwise
 */
export const deleteUser = (id) => {
  const users = getAllUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  // Verify if a user was actually removed before saving
  if (users.length !== filteredUsers.length) {
    setStorageData(STORAGE_KEY, filteredUsers);
    return true;
  }
  return false;
};