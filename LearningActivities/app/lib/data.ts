// app/lib/data.ts
import clientPromise from '@/app/lib/mongodb';
import type { Revenue, LatestInvoice, CustomerField } from './definitions';
import { formatCurrency } from './utils';
import { ObjectId } from 'mongodb';


const ITEMS_PER_PAGE = 6;

export async function fetchRevenue(): Promise<Revenue[]> {
  const client = await clientPromise;
  const db = client.db('test');
  return db.collection<Revenue>('revenue').find({}).toArray();
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

  const customers = await db.collection('customers').find({}).toArray();

  return invoices.map((invoice: any) => {
    const customer = customers.find((c: any) => c.id === invoice.customer_id);

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
    .filter((i: any) => i.status === 'paid')
    .reduce((sum: number, i: any) => sum + i.amount, 0);

  const totalPendingInvoices = invoices
    .filter((i: any) => i.status === 'pending')
    .reduce((sum: number, i: any) => sum + i.amount, 0);

  return {
    numberOfInvoices: invoices.length,
    numberOfCustomers: customersCount,
    totalPaidInvoices: formatCurrency(totalPaidInvoices),
    totalPendingInvoices: formatCurrency(totalPendingInvoices),
  };
}

export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const client = await clientPromise;
  const db = client.db('test');

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const q = query?.trim();

  const matchStage = q
    ? {
        $or: [
          { 'customer.name': { $regex: q, $options: 'i' } },
          { 'customer.email': { $regex: q, $options: 'i' } },
          { status: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  return db
    .collection('invoices')
    .aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer_id',
          foreignField: 'id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      ...(q ? [{ $match: matchStage }] : []),
      { $sort: { date: -1 } },
      { $skip: skip },
      { $limit: ITEMS_PER_PAGE },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          amount: 1,
          date: 1,
          status: 1,
          name: '$customer.name',
          email: '$customer.email',
          image_url: '$customer.image_url',
        },
      },
    ])
    .toArray();
}

export async function fetchInvoicesPages(query: string) {
  const client = await clientPromise;
  const db = client.db('test');

  const q = query?.trim();

  const matchStage = q
    ? {
        $or: [
          { 'customer.name': { $regex: q, $options: 'i' } },
          { 'customer.email': { $regex: q, $options: 'i' } },
          { status: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  const result = await db
    .collection('invoices')
    .aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer_id',
          foreignField: 'id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      ...(q ? [{ $match: matchStage }] : []),
      { $count: 'count' },
    ])
    .toArray();

  const count = result[0]?.count ?? 0;
  return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function fetchCustomers(): Promise<CustomerField[]> {
  const client = await clientPromise;
  const db = client.db('test');

  const customers = await db
    .collection('customers')
    .find({})
    .sort({ name: 1 })
    .project({ _id: 0, id: 1, name: 1 }) // only return what the form needs
    .toArray();

  return customers as CustomerField[];
}

export async function fetchInvoiceById(id: string) {
  const client = await clientPromise;
  const db = client.db('test');

  
  const { ObjectId } = await import('mongodb');

  const invoice = await db.collection('invoices').findOne({ _id: new ObjectId(id) });

  if (!invoice) return null;

  return {
    id: invoice._id.toString(),
    customer_id: invoice.customer_id,
    amount: invoice.amount,   
    status: invoice.status,
    date: invoice.date,
  };
}