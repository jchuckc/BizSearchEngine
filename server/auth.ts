import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export class AuthUtils {
  /**
   * Hash a password securely using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

  /**
   * Compare a plaintext password with a hashed password
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }
}