import Link from 'next/link';
import classes from './page.module.css';
import MealsGrid from '../../components/meals/meals-grid';
import { getMeals } from '../../lib/meals';
import { Suspense } from 'react';
import Loading from './loading-out';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meals',
  description: 'Explore a variety of delicious meals shared by our community.',
};

async function MealsData() {
  const meals = await getMeals();
  return <MealsGrid meals={meals} />;
}

export default function Meals() {
  return (
    <>
      <header className={classes.header}>
        <h1>Meals</h1>
        <span className={classes.highlight}>Delicious Recipes</span>
        <p>Explore a variety of mouth-watering meals!</p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Meal</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<Loading />}>
          <MealsData />
        </Suspense>
      </main>
    </>
  );
}
