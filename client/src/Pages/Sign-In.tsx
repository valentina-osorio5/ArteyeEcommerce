import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { Link } from 'react-router-dom';

/**
 * Form that signs in a user.
 */
export function SignIn() {
  const { handleSignIn } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      console.log(res);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();
      console.log(user);
      handleSignIn(user, token);
      console.log('Signed In', user);
      console.log('Received token:', token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ fontFamily: 'Nova Round' }}>
      <h1 className="text-xl">Sign In</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-md">
        <label className="flex flex-col items-center w-full">
          Username:
          <input
            required
            name="username"
            type="text"
            className="w-64 p-2 mt-1 border border-gray-300 rounded"
            style={{ backgroundColor: '#F6F5FF' }}
          />
        </label>

        <label className="flex flex-col items-center w-full">
          Password:
          <input
            required
            name="password"
            type="password"
            className="w-64 p-2 mt-1 border border-gray-300 rounded"
            style={{ backgroundColor: '#F6F5FF' }}
          />
        </label>

        <button
          type="submit"
          style={{ backgroundColor: '#9381EF' }}
          className="w-full py-2 border border-gray-300 rounded text-gray-800 font-semibold">
          Sign In
        </button>
      </form>

      <Link
        to="/sign-up"
        style={{ color: '#705DCC' }}
        className="mt-4 underline">
        Not registered? Sign up for an account
      </Link>
    </div>
  );
}
