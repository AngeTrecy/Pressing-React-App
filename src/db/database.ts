import Dexie, { type Table } from 'dexie';

export interface Order {
  id?: number;
  customerName: string;
  phone: string;
  status: 'Pending' | 'In Progress' | 'Ready' | 'Delivered';
  isPaid: boolean;
  dueDate: string;
  weight: number;
  items: string;
  createdAt: string;
  amount: number;
  image?: string; // Base64 image
}

export interface User {
  email: string;
  password?: string;
  name: string;
}

export class PressingDatabase extends Dexie {
  orders!: Table<Order>;
  users!: Table<User>;

  constructor() {
    super('PressingDB');
    this.version(1).stores({
      orders: '++id, customerName, phone, status, isPaid, dueDate, weight, items, createdAt',
      users: 'email, password, name'
    });
  }
}

export const db = new PressingDatabase();

export async function initAdmin() {
  const adminExists = await db.users.get('admin@pressing.com');
  if (!adminExists) {
    await db.users.add({
      email: 'admin@pressing.com',
      password: 'admin',
      name: 'Ange Admin'
    });
  }
}