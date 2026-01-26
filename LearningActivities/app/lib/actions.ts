// app/lib/actions.ts

'use server';

import { z } from 'zod';
import clientPromise from '@/app/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';

// ---------- CREATE ----------
const CreateInvoiceSchema = z.object({
  customerId: z.string().min(1),
  amount: z.coerce.number().positive(), // user types dollars (e.g. 200)
  status: z.enum(['pending', 'paid']),
});

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  const client = await clientPromise;
  const db = client.db('test');

  await db.collection('invoices').insertOne({
    customer_id: customerId,
    amount: amountInCents,
    status,
    date,
  });

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// ---------- UPDATE ----------
const UpdateInvoiceSchema = z.object({
  customerId: z.string().min(1),
  amount: z.coerce.number().positive(), // user types dollars (e.g. 200)
  status: z.enum(['pending', 'paid']),
});

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // IMPORTANT: multiply, not divide
  const amountInCents = Math.round(amount * 100);

  const client = await clientPromise;
  const db = client.db('test');

  await db.collection('invoices').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        customer_id: customerId,
        amount: amountInCents,
        status,
      },
    },
  );


  await db.collection('invoices').deleteOne({ _id: new ObjectId(id) });

  revalidatePath('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  const client = await clientPromise;
  const db = client.db('test');

  await db.collection('invoices').deleteOne({ _id: new ObjectId(id) });

  revalidatePath('/dashboard/invoices');
}
