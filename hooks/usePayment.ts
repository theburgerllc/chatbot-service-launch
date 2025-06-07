import { useState, useCallback } from 'react';
import { PaymentSession } from '@/types';
import { squareService } from '@/services/square';

export interface UsePaymentReturn {
  paymentSession: PaymentSession | null;
  isLoading: boolean;
  error: string | null;
  createPaymentSession: (planId: string, amount: number) => Promise<void>;
  verifyPayment: (paymentId: string) => Promise<boolean>;
  clearPaymentSession: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentSession = useCallback(async (planId: string, amount: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await squareService.createPaymentSession(planId, amount);
      setPaymentSession(session);
      
      // Store in session storage for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('paymentSession', JSON.stringify(session));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (paymentId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await squareService.verifyPayment(paymentId);
      
      if (result.verified && paymentSession) {
        const updatedSession = { ...paymentSession, status: 'completed' as const };
        setPaymentSession(updatedSession);
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('paymentSession', JSON.stringify(updatedSession));
        }
      }
      
      return result.verified;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [paymentSession]);

  const clearPaymentSession = useCallback(() => {
    setPaymentSession(null);
    setError(null);
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('paymentSession');
    }
  }, []);

  return {
    paymentSession,
    isLoading,
    error,
    createPaymentSession,
    verifyPayment,
    clearPaymentSession
  };
}