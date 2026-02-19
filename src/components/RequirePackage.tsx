import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type PackageType = 'startup' | 'essential' | 'premium';

type RequirePackageProps = {
  children: React.ReactNode;
  required: PackageType;
  upgradePath: string;
};

const order: Record<PackageType, number> = {
  startup: 0,
  essential: 1,
  premium: 2,
};

export default function RequirePackage({ children, required, upgradePath }: RequirePackageProps) {
  const location = useLocation();
  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;

  const allowed = order[userPackage] >= order[required];
  if (!allowed) {
    return <Navigate to={upgradePath} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
