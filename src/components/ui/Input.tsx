import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`block w-full border bg-white px-3 py-2 ${
                        error ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                    {...props}
                />
                {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
