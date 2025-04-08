import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuotePart, PriceQuantity } from '../../models/types';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AddPartFormProps {
    onAdd: (part: QuotePart) => void;
    onCancel: () => void;
    currency: 'INR' | 'USD';
}

const AddPartForm: React.FC<AddPartFormProps> = ({
    onAdd,
    onCancel,
    currency,
}) => {
    const [partName, setPartName] = useState('');
    const [moq, setMoq] = useState('');
    const [priceQuantities, setPriceQuantities] = useState<PriceQuantity[]>([
        { quantity: 0, price: 0 },
    ]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddPriceQuantity = () => {
        setPriceQuantities([...priceQuantities, { quantity: 0, price: 0 }]);
    };

    const handleRemovePriceQuantity = (index: number) => {
        setPriceQuantities(priceQuantities.filter((_, i) => i !== index));
    };

    const handlePriceQuantityChange = (
        index: number,
        field: keyof PriceQuantity,
        value: string
    ) => {
        const numValue = parseFloat(value);
        const newPriceQuantities = [...priceQuantities];
        newPriceQuantities[index] = {
            ...newPriceQuantities[index],
            [field]: isNaN(numValue) ? 0 : numValue,
        };
        setPriceQuantities(newPriceQuantities);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!partName.trim()) {
            newErrors.partName = 'Part name is required';
        }

        if (!moq || parseInt(moq) <= 0) {
            newErrors.moq = 'MOQ must be a positive number';
        }

        let isValid = true;
        priceQuantities.forEach((pq, index) => {
            if (pq.quantity <= 0) {
                newErrors[`quantity-${index}`] =
                    'Quantity must be greater than 0';
                isValid = false;
            }
            if (pq.price <= 0) {
                newErrors[`price-${index}`] = 'Price must be greater than 0';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const newPart: QuotePart = {
            id: uuidv4(),
            partName,
            moq: parseInt(moq),
            priceQuantities: priceQuantities.sort(
                (a, b) => a.quantity - b.quantity
            ),
        };

        onAdd(newPart);
        setIsSubmitting(false);
    };

    return (
        <Card className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
            <form onSubmit={handleSubmit} className='p-6'>
                <div className='mb-6 flex items-center'>
                    <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 text-indigo-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Add New Part
                    </h3>
                </div>

                <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <Input
                        label='Part Name'
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        error={errors.partName}
                        fullWidth
                        className='focus:border-indigo-500 focus:ring-indigo-500'
                        placeholder='Enter part name or description'
                    />
                    <Input
                        label='Minimum Order Quantity (MOQ)'
                        type='number'
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        error={errors.moq}
                        fullWidth
                        className='focus:border-indigo-500 focus:ring-indigo-500'
                        placeholder='Enter MOQ'
                    />
                </div>

                <div className='mt-8'>
                    <div className='mb-4 flex items-center justify-between'>
                        <h4 className='flex items-center font-medium text-gray-900'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='mr-2 h-5 w-5 text-gray-500'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            Price Per Quantity
                        </h4>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={handleAddPriceQuantity}
                            className='flex items-center border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='mr-1 h-4 w-4'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            Add Price Tier
                        </Button>
                    </div>

                    <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                        {priceQuantities.map((pq, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-1 items-end gap-4 md:grid-cols-3 ${
                                    index > 0
                                        ? 'mt-4 border-t border-gray-200 pt-4'
                                        : ''
                                }`}
                            >
                                <Input
                                    label={index === 0 ? 'Quantity' : ''}
                                    type='number'
                                    value={
                                        pq.quantity === 0
                                            ? ''
                                            : pq.quantity.toString()
                                    }
                                    onChange={(e) =>
                                        handlePriceQuantityChange(
                                            index,
                                            'quantity',
                                            e.target.value
                                        )
                                    }
                                    error={errors[`quantity-${index}`]}
                                    fullWidth
                                    className='focus:border-indigo-500 focus:ring-indigo-500'
                                    placeholder='Quantity'
                                />
                                <Input
                                    label={
                                        index === 0 ? `Price (${currency})` : ''
                                    }
                                    type='number'
                                    value={
                                        pq.price === 0
                                            ? ''
                                            : pq.price.toString()
                                    }
                                    onChange={(e) =>
                                        handlePriceQuantityChange(
                                            index,
                                            'price',
                                            e.target.value
                                        )
                                    }
                                    error={errors[`price-${index}`]}
                                    fullWidth
                                    className='focus:border-indigo-500 focus:ring-indigo-500'
                                    placeholder='Unit price'
                                />
                                <div className={index === 0 ? 'mt-7' : ''}>
                                    {priceQuantities.length > 1 && (
                                        <Button
                                            type='button'
                                            variant='danger'
                                            size='sm'
                                            onClick={() =>
                                                handleRemovePriceQuantity(index)
                                            }
                                            className='flex w-full items-center justify-center md:w-auto'
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='mr-1 h-4 w-4'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-8 flex justify-end space-x-3'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onCancel}
                        className='border-gray-300 text-gray-700 hover:bg-gray-50'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        className='flex items-center bg-indigo-600 transition-colors hover:bg-indigo-700'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className='-ml-1 mr-2 h-4 w-4 animate-spin text-white'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <circle
                                        className='opacity-25'
                                        cx='12'
                                        cy='12'
                                        r='10'
                                        stroke='currentColor'
                                        strokeWidth='4'
                                    ></circle>
                                    <path
                                        className='opacity-75'
                                        fill='currentColor'
                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    ></path>
                                </svg>
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='mr-1 h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                Add Part
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default AddPartForm;
