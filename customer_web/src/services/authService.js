// Demo mode — no Firebase, all data in localStorage

export function sendOtp(phone) {
  // Demo: always succeeds instantly
  return Promise.resolve();
}

export function createUserProfile(data) {
  const uid = 'user_' + Date.now();
  const profile = { uid, ...data, createdAt: new Date().toISOString() };
  localStorage.setItem('rgh_current_user', JSON.stringify(profile));
  const all = JSON.parse(localStorage.getItem('rgh_users') || '{}');
  all[uid] = profile;
  localStorage.setItem('rgh_users', JSON.stringify(all));
  return profile;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('rgh_current_user') || 'null');
}

export function updateUserProfile(data) {
  const profile = getCurrentUser();
  if (!profile) return;
  const updated = { ...profile, ...data };
  localStorage.setItem('rgh_current_user', JSON.stringify(updated));
  const all = JSON.parse(localStorage.getItem('rgh_users') || '{}');
  all[profile.uid] = updated;
  localStorage.setItem('rgh_users', JSON.stringify(all));
  return updated;
}

export function logout() {
  localStorage.removeItem('rgh_current_user');
}
