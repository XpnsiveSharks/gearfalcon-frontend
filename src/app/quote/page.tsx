'use client';

import React from 'react';
import { useQuotes } from './hook/useQuotes';
import QuoteForm from './components/QuoteForm';
import QuoteList from './components/QuoteList';

const QuotePage: React.FC = () => {
  const { quotes, loading, error, createQuote, acceptQuote, rejectQuote } = useQuotes();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 pt-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
          <h1 className="text-slate-900 text-2xl font-semibold">Quote Management</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Create and manage customer quotes.
          </p>

          <div className="mt-6">
            <h2 className="text-slate-900 text-xl font-semibold">Create a New Quote</h2>
            <div className="mt-4">
              <QuoteForm createQuote={createQuote} />
            </div>
          </div>

          <div className="mt-8">
            <QuoteList
              quotes={quotes}
              loading={loading}
              error={error}
              acceptQuote={acceptQuote}
              rejectQuote={rejectQuote}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuotePage;
