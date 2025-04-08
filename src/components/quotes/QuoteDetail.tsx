import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuoteContext } from '../../contexts/QuoteContext';
import { QuoteFormData, QuoteStatus } from '../../models/types';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import QuoteParts from './QuoteParts';
import AddPartForm from './AddPartForm';
import { generatePDF } from '../../services/pdfService';
import { isDateInFuture } from '../../utils/helpers';

const QuoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getQuoteById, addQuote, updateQuote } = useQuoteContext();
    const navigate = useNavigate();
    const isNewQuote = id === 'new';

    const [formData, setFormData] = useState<QuoteFormData>({
        clientName: '',
        currency: 'INR',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        status: 'DRAFT',
        parts: [],
    });

    const [isAddingPart, setIsAddingPart] = useState(false);
    const [status, setStatus] = useState<QuoteStatus>('DRAFT');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isNewQuote && id) {
            const quote = getQuoteById(id);
            if (quote) {
                setFormData({
                    clientName: quote.clientName,
                    currency: quote.currency,
                    validUntil: quote.validUntil.split('T')[0],
                    status: quote.status,
                    parts: quote.parts,
                });
                setStatus(quote.status);
            } else {
                navigate('/');
            }
        }
    }, [id, getQuoteById, isNewQuote, navigate]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);

        if (isNewQuote) {
            const newId = addQuote(formData);
            setIsSaving(false);
            navigate(`/quote/${newId}`);
        } else if (id) {
            updateQuote(id, formData);
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!isNewQuote && id) {
            const quote = getQuoteById(id);
            if (quote) {
                try {
                    await generatePDF(quote);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Could not generate PDF. Check console for details.');
                }
            }
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as QuoteStatus;
        setStatus(newStatus);
        setFormData((prev) => ({ ...prev, status: newStatus }));
    };

    const statusOptions = [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'SENT', label: 'Sent' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'EXPIRED', label: 'Expired' },
    ];

    const currencyOptions = [
        { value: 'INR', label: 'INR (₹)' },
        { value: 'USD', label: 'USD ($)' },
    ];

    const getStatusColor = () => {
        switch (status) {
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800';
            case 'SENT':
                return 'bg-blue-100 text-blue-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'EXPIRED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='mx-auto max-w-7xl'>
            <div className='mb-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <button
                            onClick={() => navigate('/')}
                            className='mr-4 rounded-full p-2 transition-colors hover:bg-gray-100'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5 text-gray-500'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </button>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>
                                {isNewQuote
                                    ? 'Create New Quote'
                                    : `Quote ${
                                          formData.clientName
                                              ? `for ${formData.clientName}`
                                              : ''
                                      }`}
                            </h1>
                            {!isNewQuote && (
                                <div className='mt-1 flex items-center'>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor()}`}
                                    >
                                        {status}
                                    </span>
                                    <span className='mx-2 text-gray-300'>
                                        •
                                    </span>
                                    <span
                                        className={`text-sm ${
                                            isDateInFuture(formData.validUntil)
                                                ? 'text-gray-500'
                                                : 'text-red-500'
                                        }`}
                                    >
                                        {isDateInFuture(formData.validUntil)
                                            ? `Valid until `
                                            : `Expired on `}
                                        {new Date(
                                            formData.validUntil
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex space-x-3'>
                        <Button
                            variant='outline'
                            onClick={() => navigate('/')}
                            className='border-gray-300 text-gray-700 hover:bg-gray-50'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className='flex items-center bg-indigo-600 shadow-sm transition-colors hover:bg-indigo-700'
                            disabled={isSaving}
                        >
                            {isSaving ? (
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
                                    Saving...
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
                                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                    Save Quote
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
                        <CardHeader className='border-b border-gray-200 bg-gray-50 px-6 py-4'>
                            <h2 className='flex items-center text-lg font-medium text-gray-900'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='mr-2 h-5 w-5 text-gray-500'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                Client Information
                            </h2>
                        </CardHeader>
                        <CardBody className='space-y-4 p-6'>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <Input
                                    label='Client Name'
                                    name='clientName'
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    placeholder='Enter client name'
                                    fullWidth
                                    className='focus:border-indigo-500 focus:ring-indigo-500'
                                />
                                <Dropdown
                                    label='Currency'
                                    name='currency'
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    options={currencyOptions}
                                    fullWidth
                                    className='focus:border-indigo-500 focus:ring-indigo-500'
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <Input
                                    label='Valid Until'
                                    type='date'
                                    name='validUntil'
                                    value={formData.validUntil}
                                    onChange={handleInputChange}
                                    fullWidth
                                    className='focus:border-indigo-500 focus:ring-indigo-500'
                                />
                                {!isNewQuote && (
                                    <Dropdown
                                        label='Status'
                                        value={status}
                                        onChange={handleStatusChange}
                                        options={statusOptions}
                                        fullWidth
                                        className='focus:border-indigo-500 focus:ring-indigo-500'
                                    />
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    <div className='mt-6'>
                        <Card className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
                            <CardHeader className='flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4'>
                                <h2 className='flex items-center text-lg font-medium text-gray-900'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='mr-2 h-5 w-5 text-gray-500'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                                    </svg>
                                    Quote Parts ({formData.parts.length})
                                </h2>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => setIsAddingPart(true)}
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
                                    Add Part
                                </Button>
                            </CardHeader>
                            <CardBody className='p-0'>
                                {isAddingPart ? (
                                    <div className='p-6'>
                                        <AddPartForm
                                            onAdd={(newPart) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    parts: [
                                                        ...prev.parts,
                                                        newPart,
                                                    ],
                                                }));
                                                setIsAddingPart(false);
                                            }}
                                            onCancel={() =>
                                                setIsAddingPart(false)
                                            }
                                            currency={formData.currency}
                                        />
                                    </div>
                                ) : (
                                    <QuoteParts
                                        parts={formData.parts}
                                        currency={formData.currency}
                                        onDeletePart={(id) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                parts: prev.parts.filter(
                                                    (part) => part.id !== id
                                                ),
                                            }));
                                        }}
                                    />
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                <div className='lg:col-span-1'>
                    <Card className='sticky top-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
                        <CardHeader className='border-b border-gray-200 bg-gray-50 px-6 py-4'>
                            <h2 className='flex items-center text-lg font-medium text-gray-900'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='mr-2 h-5 w-5 text-gray-500'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z'
                                        clipRule='evenodd'
                                    />
                                    <path d='M10 13a3 3 0 100-6 3 3 0 000 6z' />
                                </svg>
                                Quote Actions
                            </h2>
                        </CardHeader>
                        <CardBody className='p-6'>
                            <div className='space-y-4'>
                                {!isNewQuote && (
                                    <Button
                                        variant='outline'
                                        className='flex w-full items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50'
                                        onClick={handleDownloadPDF}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='mr-2 h-5 w-5 text-red-500'
                                            viewBox='0 0 20 20'
                                            fill='currentColor'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        Download as PDF
                                    </Button>
                                )}

                                <Button
                                    onClick={handleSave}
                                    className='flex w-full items-center justify-center bg-indigo-600 transition-colors hover:bg-indigo-700'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='mr-2 h-5 w-5'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                    Save Quote
                                </Button>

                                {!isNewQuote && (
                                    <div className='mt-6 border-t border-gray-200 pt-6'>
                                        <h3 className='mb-3 text-sm font-medium text-gray-500'>
                                            Quick Actions
                                        </h3>

                                        <div className='space-y-2'>
                                            {status === 'DRAFT' && (
                                                <button
                                                    className='flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-blue-700 transition-colors hover:bg-blue-50'
                                                    onClick={() => {
                                                        setStatus('SENT');
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            status: 'SENT',
                                                        }));
                                                    }}
                                                >
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        className='mr-2 h-4 w-4'
                                                        viewBox='0 0 20 20'
                                                        fill='currentColor'
                                                    >
                                                        <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
                                                    </svg>
                                                    Mark as Sent
                                                </button>
                                            )}

                                            {status === 'SENT' && (
                                                <>
                                                    <button
                                                        className='flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-green-700 transition-colors hover:bg-green-50'
                                                        onClick={() => {
                                                            setStatus(
                                                                'ACCEPTED'
                                                            );
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    status: 'ACCEPTED',
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            className='mr-2 h-4 w-4'
                                                            viewBox='0 0 20 20'
                                                            fill='currentColor'
                                                        >
                                                            <path
                                                                fillRule='evenodd'
                                                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                                clipRule='evenodd'
                                                            />
                                                        </svg>
                                                        Mark as Accepted
                                                    </button>

                                                    <button
                                                        className='flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50'
                                                        onClick={() => {
                                                            setStatus(
                                                                'REJECTED'
                                                            );
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    status: 'REJECTED',
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            className='mr-2 h-4 w-4'
                                                            viewBox='0 0 20 20'
                                                            fill='currentColor'
                                                        >
                                                            <path
                                                                fillRule='evenodd'
                                                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                                                clipRule='evenodd'
                                                            />
                                                        </svg>
                                                        Mark as Rejected
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                className='flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-indigo-700 transition-colors hover:bg-indigo-50'
                                                onClick={() =>
                                                    navigate(`/quote/new`)
                                                }
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className='mr-2 h-4 w-4'
                                                    viewBox='0 0 20 20'
                                                    fill='currentColor'
                                                >
                                                    <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                                                    <path
                                                        fillRule='evenodd'
                                                        d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                                                        clipRule='evenodd'
                                                    />
                                                </svg>
                                                Create New Quote
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!isNewQuote && (
                                    <div className='mt-6 border-t border-gray-200 pt-6'>
                                        <div className='rounded-md border border-gray-200 bg-gray-50 p-4'>
                                            <h3 className='mb-2 text-sm font-medium text-gray-700'>
                                                Quote Summary
                                            </h3>
                                            <div className='space-y-2 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500'>
                                                        Total Parts:
                                                    </span>
                                                    <span className='font-medium'>
                                                        {formData.parts.length}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500'>
                                                        Status:
                                                    </span>
                                                    <span
                                                        className={`font-medium ${getStatusColor()} rounded-full px-2 py-0.5 text-xs`}
                                                    >
                                                        {status}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500'>
                                                        Created:
                                                    </span>
                                                    <span className='font-medium'>
                                                        {new Date().toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetail;
