// LearningActivities/app/lib/definitions.ts
export type Revenue = {
  month: string;
  revenue: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
  date: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type LatestInvoice = {
  id: string;
  amount: string;      // tutorial uses formatted string like "$666.00"
  name: string;
  email: string;
  image_url: string;
};
