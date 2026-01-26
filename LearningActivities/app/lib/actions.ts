// app/lib/actions.ts

'use server';

import { z } from 'zod';
import clientPromise from '@/app/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';

const CreateInvoiceSchema = z.object({
  customerId: z.string().min(1),
  amount: z.coerce.number().positive(),
  status: z.enum(['pending', 'paid']),
});

const UpdateInvoiceSchema = z.object({
  customerId: z.string().min(1),
  amount: z.coerce.number().positive(),
  status: z.enum(['pending', 'paid']),
});

export async function createInvoice(formData: FormData): Promise<void> {
  const { customerId, amount, status } = CreateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  try {
    const client = await clientPromise;
    const db = client.db('test');

    await db.collection('invoices').insertOne({
      customer_id: customerId,
      amount: amountInCents,
      status,
      date,
    });
  } catch (error) {
    console.error(error);
    // IMPORTANT: don't return an object from a form action
    throw new Error('Database Error: Failed to Create Invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = Math.round(amount * 100);

  try {
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
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error('Database Error: Failed to Create Invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db('test');

    await db.collection('invoices').deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error(error);
    throw new Error('Database Error: Failed to Create Invoice.');
  }

  revalidatePath('/dashboard/invoices');
}
