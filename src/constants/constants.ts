export const apiUrl = "http://127.0.0.1:8000/api/v1";

export const timeOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
} as const;

export interface IUserData {
  email: string;
  id: number;
  username: string;
}
