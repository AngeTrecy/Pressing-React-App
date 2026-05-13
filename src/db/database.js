import Dexie from 'dexie';

export const db = new Dexie('PressingDB');

db.version(1).stores({
    orders: '++id, customerName, phone, status, isPaid, dueDate, weight, items, createdAt',
    users: 'email, password, name'
});


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