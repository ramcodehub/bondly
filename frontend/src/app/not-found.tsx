import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | CRM Dashboard',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: 'noindex, nofollow',
};

export const viewport = {
  themeColor: '#ffffff',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
