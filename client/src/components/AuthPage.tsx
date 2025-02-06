import { Link } from 'react-router-dom';
import { SignIn } from '../Pages/Sign-In';
import { SignUpForm } from '../Pages/Sign-Up';

type Mode = 'sign-in' | 'sign-up';

type Props = {
  mode: Mode;
};

export function AuthPage({ mode }: Props) {
  return (
    <div className="justify-center pl-4 ml-4">
      {mode === 'sign-up' && <SignUpForm />}
      {mode === 'sign-in' && <SignIn />}
      <div className="margin-1">
        {mode === 'sign-in' && <Link to="/sign-up">Register instead</Link>}
        {mode === 'sign-up' && <Link to="/sign-in">Sign In instead</Link>}
      </div>
    </div>
  );
}
