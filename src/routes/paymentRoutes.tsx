// src/routes/PaymentRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentPage from '../pages/payment/PaymentPage';
import NewPaymentPage from '../pages/payment/NewPaymentPage';
import PaymentDetailsPage from '../pages/payment/PaymentDetailsPage';
import PaymentStatisticsPage from '../pages/payment/PaymentStatisticsPage';
import AdminPaymentsPage from '../pages/payment/AdminPaymentsPage';

const PaymentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentPage />} />
      <Route path="/new" element={<NewPaymentPage />} />
      <Route path="/:id" element={<PaymentDetailsPage />} />
      <Route path="/statistics" element={<PaymentStatisticsPage />} />
      <Route path="/admin" element={<AdminPaymentsPage />} />
    </Routes>
  );
};

export default PaymentRoutes;