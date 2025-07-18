'use server';

import { redirect } from 'next/navigation';
import { Meal } from '../types/meals';
import { addMeal } from './meals';
import { revalidatePath } from 'next/cache';

const isInvalidText = (text: string | undefined) => {
  return !text || text.trim() === '' || text.length < 2 || text.length > 5000;
};

const isInvalidEmail = (email: string | undefined) => {
  return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const shareMealHandler = async (
  prevState: { message: string },
  formData: FormData
) => {
  const meal = {
    title: formData.get('title') as string,
    summary: formData.get('summary') as string,
    instructions: formData.get('instructions') as string,
    creator: formData.get('name') as string,
    creator_email: formData.get('email') as string,
  } as Partial<Meal>;

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email)
  ) {
    return {
      message:
        'All fields are required. And must be at least 2 character long.',
    };
  }

  if (isInvalidEmail(meal.creator_email)) {
    return {
      message: 'Invalid email address.',
    };
  }

  if (
    typeof formData.get('image') !== 'object' ||
    !(formData.get('image') instanceof File)
  ) {
    return {
      message: 'Image is required and must be a file.',
    };
  }

  await addMeal({
    ...meal,
    image: formData.get('image') as File,
  } as Meal & { image: File });

  revalidatePath('/meals');
  redirect('/meals');
};
