export interface Subject {
  id: number;
  name: string;
  code: string;
  grades?: number[]; // Array of grade IDs
  // Add any other relevant fields from your backend
}
