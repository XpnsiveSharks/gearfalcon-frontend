"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
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
                    <CheckCircle className="text-green-500" size={64} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Congrats! Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Your service request has been received. You will be redirected to your dashboard shortly.
                </p>
                <Link href="/customer" className="px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Go Back
                </Link>
            </div>
        </div>
    );
}