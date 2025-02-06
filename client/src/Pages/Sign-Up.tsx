import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Form that registers a user.
 */
export function SignUpForm() {
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      console.log('Registered', user);
      console.log(
        `You can check the database with: psql -d userManagement -c 'select * from users'`
      );
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}.`
      );
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ fontFamily: 'Nova Round' }}>
      <h1 className="text-xl p-4">Register</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md space-y-4">
        <label className="flex flex-col items-center w-full">
          Username:
          <input
            required
            name="username"
            type="text"
            className="w-64 p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ backgroundColor: '#F6F5FF' }}
          />
        </label>

        <label className="flex flex-col items-center w-full">
          Password:
          <input
            required
            name="password"
            type="password"
            className="w-64 p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ backgroundColor: '#F6F5FF' }}
          />
        </label>

        <button
          type="submit"
          style={{ backgroundColor: '#9381EF' }}
          className="w-full py-2 border border-gray-300 rounded text-gray-800 font-semibold">
          Register
        </button>
      </form>
    </div>
  );
}
