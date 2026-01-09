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
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Define the form data type
type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SignUpForm = ({ onSuccess, onError }: SignUpFormProps) => {
  const router = useRouter();
  const { login } = useAuth();

  // Set up the form with React Hook Form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Call the API to sign up
      const response = await apiService.auth.register(data.email, data.password, data.name);

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
        const errorMessage = response.error || 'An error occurred during sign up';
        setError('root', { message: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign up';
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
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>
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
      <div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>
      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        className="mt-4"
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;