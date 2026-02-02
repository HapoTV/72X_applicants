// src/routes/PaymentRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentPage from '../pages/payment/PaymentPage';
import NewPaymentPage from '../pages/payment/NewPaymentPage';
import PaymentDetailsPage from '../pages/payment/PaymentDetailsPage';
import PaymentStatisticsPage from '../pages/payment/PaymentStatisticsPage';
import AdminPaymentsPage from '../pages/payment/AdminPaymentsPage';
import ProtectedPaymentRoutes from '../components/ProtectedPaymentRoutes';

const PaymentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentPage />} />
      <Route element={<ProtectedPaymentRoutes />}>
        <Route path="/new" element={<NewPaymentPage />} />
        <Route path="/:id" element={<PaymentDetailsPage />} />
      </Route>
      <Route path="/statistics" element={<PaymentStatisticsPage />} />
      <Route path="/admin" element={<AdminPaymentsPage />} />
    </Routes>
  );
};

export default PaymentRoutes;