import React from 'react';

type PackageType = 'startup' | 'essential' | 'premium';

type RequirePackageProps = {
  children: React.ReactNode;
  required: PackageType;
  upgradePath: string;
};

export default function RequirePackage({ children }: RequirePackageProps) {
  return <>{children}</>;
}
