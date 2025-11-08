"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelledPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/customer');
        }, 10000); // 10 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <XCircle className="text-red-500" size={64} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failure</h1>
                <p className="text-gray-600 mb-6">
                    Your payment was not completed. You will be redirected to your dashboard to try again.
                </p>
                <Link href="/customer" className="px-8 py-3 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors">
                    Try Again
                </Link>
            </div>
        </div>
    );
}