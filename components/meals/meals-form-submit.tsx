'use client';
import { useFormStatus } from 'react-dom';

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();
  return <button type="submit">{pending ? 'Sharing...' : 'Share Meal'}</button>;
}
