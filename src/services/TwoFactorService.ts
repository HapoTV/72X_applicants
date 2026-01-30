// src/services/TwoFactorService.ts
import axiosClient from '../api/axiosClient';

export interface TOTPSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TOTPVerifyRequest {
  userId: string;
  code: string;
}

export interface TOTPVerifyResponse {
  success: boolean;
  message: string;
  backupCodes?: string[];
}

export interface TOTPStatusResponse {
  enabled: boolean;
  backupCodesRemaining?: number;
}

class TwoFactorService {
  /**
   * Generate TOTP secret and QR code for setup
   */
  async generateTOTPSecret(userId: string): Promise<TOTPSetupResponse> {
    try {
      const response = await axiosClient.post('/two-factor/generate-secret', { userId });
      return response.data;
    } catch (error) {
      console.error('Generate TOTP secret error:', error);
      throw new Error('Failed to generate TOTP secret.');
    }
  }

  /**
   * Verify TOTP code and enable 2FA
   */
  async verifyAndEnableTOTP(userId: string, code: string): Promise<TOTPVerifyResponse> {
    try {
      const response = await axiosClient.post('/two-factor/verify-and-enable', {
        userId,
        code
      });
      return response.data;
    } catch (error) {
      console.error('Verify TOTP error:', error);
      throw new Error('Invalid TOTP code. Please try again.');
    }
  }

  /**
   * Verify TOTP code during login
   */
  async verifyTOTPForLogin(userId: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.post('/two-factor/verify-login', {
        userId,
        code
      });
      return response.data;
    } catch (error) {
      console.error('Verify TOTP for login error:', error);
      throw new Error('Invalid TOTP code. Please try again.');
    }
  }

  /**
   * Use backup code for login
   */
  async verifyBackupCodeForLogin(userId: string, backupCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.post('/two-factor/verify-backup-code', {
        userId,
        backupCode
      });
      return response.data;
    } catch (error) {
      console.error('Verify backup code error:', error);
      throw new Error('Invalid backup code. Please try again.');
    }
  }

  /**
   * Get TOTP status for user
   */
  async getTOTPStatus(userId: string): Promise<TOTPStatusResponse> {
    try {
      const response = await axiosClient.get(`/two-factor/status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get TOTP status error:', error);
      throw new Error('Failed to get 2FA status.');
    }
  }

  /**
   * Disable TOTP 2FA
   */
  async disableTOTP(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.post('/two-factor/disable', { userId });
      return response.data;
    } catch (error) {
      console.error('Disable TOTP error:', error);
      throw new Error('Failed to disable 2FA.');
    }
  }

  /**
   * Generate new backup codes
   */
  async generateNewBackupCodes(userId: string): Promise<{ backupCodes: string[] }> {
    try {
      const response = await axiosClient.post('/two-factor/generate-backup-codes', { userId });
      return response.data;
    } catch (error) {
      console.error('Generate backup codes error:', error);
      throw new Error('Failed to generate backup codes.');
    }
  }

  /**
   * Fallback: Generate TOTP secret locally for development
   */
  generateSecretLocally(): { secret: string; qrCode: string; backupCodes: string[] } {
    // Simple 32-char base32 secret (RFC 4648)
    const secret = this.generateRandomSecret();
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // For development, we'll create a simple QR code URL
    // In production, use qrcode library to generate actual QR codes
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=otpauth://totp/BusinessGrowthApp:placeholder@example.com?secret=${secret}&issuer=BusinessGrowthApp`;

    return { secret, qrCode, backupCodes };
  }

  /**
   * Generate random base32 secret
   */
  private generateRandomSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  /**
   * Verify TOTP code locally (for development fallback)
   */
  verifyTOTPLocally(secret: string, code: string): boolean {
    // This is a simplified version for development
    // In production, use a proper TOTP library like speakeasy or otplib
    const storedCode = localStorage.getItem(`totp_verification_${secret}`);
    if (!storedCode) {
      // Generate a test code for demo purposes
      const testCode = this.generateTestTOTPCode(secret);
      localStorage.setItem(`totp_verification_${secret}`, testCode);
      return code === testCode;
    }
    return code === storedCode;
  }

  /**
   * Generate a test TOTP code for development
   */
  private generateTestTOTPCode(secret: string): string {
    // Generate a 6-digit code based on secret
    const hash = secret.split('').reduce((acc, char, i) => {
      return acc + char.charCodeAt(0) * (i + 1);
    }, 0);
    return String((hash % 1000000)).padStart(6, '0');
  }
}

export const twoFactorService = new TwoFactorService();
