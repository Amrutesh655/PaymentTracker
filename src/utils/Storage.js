// USERS STORAGE KEY
const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// SIGNUP
export const signup = ({ name, email, password }) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return { success: false, message: "User already exists" };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return { success: true };
};

// LOGIN
export const login = ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return { success: true, user };
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// GET CURRENT USER
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
};

const PAYMENTS_KEY = "payments";

// ADD PAYMENT
export const addPayment = ({ title, amount, status }) => {
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

  const user = getCurrentUser();

  const newPayment = {
    id: Date.now(),
    user_id: user.id,
    title,
    amount,
    status,
  };

  payments.push(newPayment);

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  return { success: true };
};

// GET PAYMENTS
export const getPayments = () => {
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];
  const user = getCurrentUser();

  return payments.filter((p) => p.user_id === user.id);
};

// DELETE PAYMENT
export const deletePayment = (id) => {
  let payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

  payments = payments.filter((p) => p.id !== id);

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  return { success: true };
};

// UPDATE PAYMENT
export const updatePayment = (id, updatedData) => {
  let payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];

  payments = payments.map((p) =>
    p.id === id ? { ...p, ...updatedData } : p
  );

  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  return { success: true };
};