import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Sahal Arbani Livery.',
};

export default function TermsOfService() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-dark">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Kembali ke Home
        </Link>
        <div className="prose prose-invert prose-brand max-w-none">
          <h1>Terms of Service</h1>
          <p>Welcome to Sahal Arbani Livery!</p>
          <p>
            These terms and conditions outline the rules and regulations for the use of Sahal Arbani Livery's Website, located at https://arbskin.vercel.app.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Sahal Arbani Livery if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2>License</h2>
          <p>
            Unless otherwise stated, Sahal Arbani Livery and/or its licensors own the intellectual property rights for all material on Sahal Arbani Livery. All intellectual property rights are reserved. You may access this from Sahal Arbani Livery for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Sahal Arbani Livery without crediting</li>
            <li>Sell, rent or sub-license material from Sahal Arbani Livery</li>
            <li>Reproduce, duplicate or copy material from Sahal Arbani Livery for commercial purposes without explicit permission</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
