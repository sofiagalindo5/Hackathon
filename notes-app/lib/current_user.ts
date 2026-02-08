export type CurrentUser = {
  email: string;
  name: string;
  userId: string;
  phone?: string;
};

let currentUser: CurrentUser = {
  email: "",
  name: "",
  userId: "",
  phone: "",
};

export function getCurrentUser(): CurrentUser {
  return currentUser;
}

export function setCurrentUser(next: Partial<CurrentUser>) {
  const merged = { ...currentUser, ...next } as CurrentUser;
  if (!next.userId && next.email) {
    merged.userId = next.email;
  }
  currentUser = merged;
}
