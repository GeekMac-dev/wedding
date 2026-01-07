import { useState } from 'react';
import { X } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDefault, setShowDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username === 'Admin' && password === 'M@cD3n1993') {
      onSuccess();
    } else {
      setError('Invalid credentials');
    }
  };

  const fillDefault = () => {
    setUsername('Admin');
    setPassword('M@cD3n1993');
    setShowDefault(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-semibold mb-2">Admin Login</h3>
        <p className="text-sm text-gray-500 mb-4">Please sign in to access the admin panel.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-rose-500 text-white">Sign in</button>
            {/* <button
              type="button"
              onClick={fillDefault}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
            >
              Use default
            </button> */}
          </div>
        </form>

        {/* <div className="mt-4">
          <button
            onClick={() => setShowDefault(!showDefault)}
            className="text-sm text-gray-600 underline"
          >
            {showDefault ? 'Hide default login' : 'Show default login'}
          </button>

          {showDefault && (
            <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <div><strong>Username:</strong> Admin</div>
              <div><strong>Password:</strong> M@cD3n1993</div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
