/// app/lib/actions.ts

'use server';

import { z } from 'zod';
import clientPromise from '@/app/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
  status: z.enum(['pending', 'paid']),
});

export async function createInvoice(formData: FormData) {
  // 1) Extract + validate
  const { customerId, amount, status } = FormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 2) Store in cents (avoid floating point issues)
  const amountInCents = Math.round(amount * 100);

  // 3) Create date "YYYY-MM-DD"
  const date = new Date().toISOString().split('T')[0];

  // 4) Insert into MongoDB
  const client = await clientPromise;
  const db = client.db('test');

  await db.collection('invoices').insertOne({
    customer_id: customerId, // match your existing invoice schema
    amount: amountInCents,
    status,
    date,
  });

  // 5) Revalidate + redirect
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
