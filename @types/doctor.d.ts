export interface Doctor {
  id: number;
  name: string;
  image?: string;
  specialist: string;
  priority: number;
  status: "Online" | "Offline";
  qualification?: string;
}
