import React from 'react';
import { LoginUnified } from './LoginUnified';

export const LoginStudent: React.FC = () => {
  return <LoginUnified initialRole="student" />;
};

export default LoginStudent;
