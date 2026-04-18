import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Hubungi Sahal Arbani Livery untuk kerja sama, komplain, atau bantuan teknis.',
};

export default function Contact() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-dark">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Kembali ke Home
        </Link>
        <div className="prose prose-invert prose-brand max-w-none">
          <h1>Contact Us</h1>
          <p>
            Memiliki pertanyaan terkait aset simulasi (Truckers of Europe 3), keluhan hak cipta, atau ingin melakukan kemitraan (business inquiries)? Kami siap membantu Anda.
          </p>

          <div className="p-6 bg-brand-onyx border border-white/10 rounded-2xl my-8">
            <h3 className="flex items-center gap-2 text-white m-0 pb-4">
              <Mail className="text-brand-accent" size={20} /> Surel Resmi
            </h3>
            <p className="m-0 text-gray-400">
              Silakan kirimkan email Anda ke <strong>sahalpanglima@gmail.com</strong>.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              *Harap cantumkan subjek yang relevan (misal: "Partnership AdSense", "Takedown Request", dsb).
            </p>
          </div>

          <p>
            Kami berkomitmen memberikan respon dalam waktu maksimal 2 x 24 jam kerja terhadap segala pertanyaan mengenai pedoman, kebijakan privasi, atau syarat layanan kami.
          </p>
        </div>
      </div>
    </div>
  );
}
