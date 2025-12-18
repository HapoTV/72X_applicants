import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupSuccessRouter: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const provided = localStorage.getItem('userProvidedBusinessReference');
    if (provided === 'true') navigate('/signup/success/provided', { replace: true });
    else navigate('/signup/success/generated', { replace: true });
  }, [navigate]);

  return null;
};

export default SignupSuccessRouter;
