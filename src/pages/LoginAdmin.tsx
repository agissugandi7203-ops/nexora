import React from 'react';
import { LoginUnified } from './LoginUnified';

export const LoginAdmin: React.FC = () => {
  return <LoginUnified initialRole="admin" />;
};

export default LoginAdmin;
