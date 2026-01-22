// app/lib/data.ts
import clientPromise from '@/app/lib/mongodb';
import type{ LatestInvoice, Revenue } from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue(): Promise<Revenue[]> {
  const  client = await clientPromise;
  const db = client.db('test');
  return db
    .collection<Revenue>('revenue')
    .find({}).toArray();
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  const client = await clientPromise;
  const db = client.db('test');


  const invoices = await db
    .collection('invoices')
    .find({})
    .sort({ date: -1 })
    .limit(5)
    .toArray();

  const customers = await db
    .collection('customers')
    .find({})
    .toArray();

  return invoices.map((invoice, index) => {
    const customer = customers.find(
      (c) => c.id === invoice.customer_id
    );

    return {
      id: invoice._id.toString(),
      amount: formatCurrency(invoice.amount),

      name: customer?.name ?? 'Unknown',
      email: customer?.email ?? '',
      image_url: customer?.image_url ?? '/customers/default.png',
    };
  });
}

export async function fetchCardData() {
  const client = await clientPromise;
  const db = client.db('test');


  const invoices = await db.collection('invoices').find({}).toArray();
  const customersCount = await db.collection('customers').countDocuments();

  const totalPaidInvoices = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPendingInvoices = invoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  return {
    numberOfInvoices: invoices.length,
    numberOfCustomers: customersCount,
    totalPaidInvoices: formatCurrency(totalPaidInvoices),
    totalPendingInvoices: formatCurrency(totalPendingInvoices),
  };
}
