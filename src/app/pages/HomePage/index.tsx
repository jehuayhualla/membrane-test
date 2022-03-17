import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import { Quiz } from 'app/components/Quiz';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="Membrane Test" />
      </Helmet>
      <Header />
      <Quiz />
    </>
  );
}
