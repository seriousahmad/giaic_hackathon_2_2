'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/lib/api';

// Define the Zod schema for validation
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Define the form data type
type SignInFormData = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SignInForm = ({ onSuccess, onError }: SignInFormProps) => {
  const router = useRouter();
  const { login } = useAuth();

  // Set up the form with React Hook Form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Call the API to sign in
      const response = await apiService.auth.login(data.email, data.password);

      if (response.success && response.data) {
        // Store tokens
        apiService.setTokens(response.data.token);

        // Update auth context
        login(response.data.user, response.data.token);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Default redirect to dashboard
          router.push('/dashboard');
        }
      } else {
        const errorMessage = response.error || 'Invalid credentials';
        setError('root', { message: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign in';
      setError('root', { message: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errors.root.message}
        </div>
      )}
      <div>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        className="mt-4"
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;