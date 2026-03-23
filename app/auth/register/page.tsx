import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Create Account - CarCollector',
  description: 'Create your CarCollector account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Join 50,000+ collector car enthusiasts</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  );
}
