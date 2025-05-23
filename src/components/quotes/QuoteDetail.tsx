/**
 * QuoteDetail.tsx
 *
 * Component for creating and editing individual quotes.
 * Handles form state, validation, and submission.
 */

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
import { generatePDFLegacy } from '../../services/pdfService';
import { isDateInFuture } from '../../utils/helpers';

/**
 * QuoteDetail component manages the creation and editing of quotes.
 * Handles form state, validation, and submission to the API.
 * Provides different functionality based on whether it's a new quote or editing an existing one.
 */
const QuoteDetail: React.FC = () => {
    // Get ID from URL parameters
    const { id } = useParams<{ id: string }>();

    // Access quote context for CRUD operations
    const {
        getQuoteById,
        addQuote,
        updateQuote,
        updateQuoteStatus,
        deleteQuote,
    } = useQuoteContext();
    const navigate = useNavigate();
    const isNewQuote = id === 'new';

    /**
     * Initial form state with default values for a new quote
     */
    const [formData, setFormData] = useState<QuoteFormData>({
        _id: '',
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
    const [showMobileActions, setShowMobileActions] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            if (!isNewQuote && id) {
                const quote = await getQuoteById(id);
                if (quote) {
                    setFormData({
                        _id: quote._id || '',
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
        };

        fetchQuote();
    }, [id, getQuoteById, isNewQuote, navigate]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);

        if (isNewQuote) {
            const newId = await addQuote(formData);
            setIsSaving(false);
            navigate(`/quote/${newId}`);
        } else if (id) {
            await updateQuote(formData._id, formData);
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this quote?')) {
            await deleteQuote(formData._id);
            navigate('/');
        }
    };

    const handleDownloadPDF = async () => {
        if (!isNewQuote && id) {
            const quote = await getQuoteById(id);
            if (quote) {
                try {
                    await generatePDFLegacy(quote);
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Could not generate PDF. Check console for details.');
                }
            }
        }
    };

    const handleStatusChange = async (
        newStatus: QuoteStatus = formData.status
    ) => {
        await updateQuoteStatus(formData._id, newStatus);
        setStatus(newStatus);
        setFormData((prev) => ({ ...prev, status: newStatus }));
    };

    const statusOptions = [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'SENT', label: 'Sent' },
        { value: 'APPROVED', label: 'Approved' },
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
            case 'APPROVED':
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
        <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm'>
                <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <div className='flex items-center'>
                        <button
                            onClick={() => navigate('/')}
                            className='mr-3 rounded-full p-2 transition-colors hover:bg-gray-100'
                            aria-label='Back to quotes'
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
                        <div className='max-w-full overflow-hidden'>
                            <h1 className='truncate text-xl font-bold text-gray-900 sm:text-2xl'>
                                {isNewQuote
                                    ? 'Create New Quote'
                                    : `Quote ${
                                          formData.clientName
                                              ? `for ${formData.clientName}`
                                              : ''
                                      }`}
                            </h1>
                            {!isNewQuote && (
                                <div className='mt-1 flex flex-wrap items-center gap-2'>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor()}`}
                                    >
                                        {status}
                                    </span>
                                    <span className='hidden text-gray-300 sm:inline-block'>
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
                    <div className='flex space-x-2 sm:space-x-3'>
                        <Button
                            variant='outline'
                            onClick={() => navigate('/')}
                            className='flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 sm:flex-none'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className='flex flex-1 items-center justify-center bg-indigo-600 shadow-sm transition-colors hover:bg-indigo-700 disabled:bg-gray-400 sm:flex-none'
                            disabled={isSaving || status !== 'DRAFT'}
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
                                    <span className='sm:hidden'>Saving</span>
                                    <span className='hidden sm:inline'>
                                        Saving...
                                    </span>
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
                                    <span className='sm:hidden'>Save</span>
                                    <span className='hidden sm:inline'>
                                        Save Quote
                                    </span>
                                </>
                            )}
                        </Button>

                        {!isNewQuote && (
                            <div className='relative sm:hidden'>
                                <button
                                    className='rounded-md bg-white p-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                    onClick={() =>
                                        setShowMobileActions(!showMobileActions)
                                    }
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                                    </svg>
                                </button>

                                {showMobileActions && (
                                    <div className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5'>
                                        <button
                                            className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                                            onClick={() => {
                                                handleDownloadPDF();
                                                setShowMobileActions(false);
                                            }}
                                        >
                                            Download as PDF
                                        </button>
                                        <button
                                            className='block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100'
                                            onClick={() => {
                                                handleDelete();
                                                setShowMobileActions(false);
                                            }}
                                        >
                                            Delete Quote
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <Card className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
                        <CardHeader className='border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6'>
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
                        <CardBody className='space-y-4 p-4 sm:p-6'>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <Input
                                    label='Client Name'
                                    name='clientName'
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    placeholder='Enter client name'
                                    fullWidth
                                    className='focus:border-indigo-500 focus:ring-indigo-500'
                                    disabled={status !== 'DRAFT'}
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
                                    disabled={status !== 'DRAFT'}
                                />
                                {!isNewQuote && (
                                    <Dropdown
                                        label='Status'
                                        value={status}
                                        onChange={(e) => {
                                            handleStatusChange(
                                                e.target.value as QuoteStatus
                                            );
                                        }}
                                        options={statusOptions}
                                        fullWidth
                                        className='focus:border-indigo-500 focus:ring-indigo-500'
                                        disabled={status !== 'DRAFT'}
                                    />
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    <div className='mt-6'>
                        <Card className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
                            <CardHeader className='flex flex-col space-y-2 border-b border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:px-6'>
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
                                    className='flex w-full items-center justify-center border-indigo-200 text-indigo-600 hover:bg-indigo-50 disabled:bg-gray-100 disabled:text-gray-400 sm:w-auto'
                                    disabled={status !== 'DRAFT'}
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
                                    <div className='p-4 sm:p-6'>
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
                                    <div className='overflow-x-auto'>
                                        <QuoteParts
                                            parts={formData.parts}
                                            currency={formData.currency}
                                            disabled={status !== 'DRAFT'}
                                            onDeletePart={(name) => {
                                                if (status !== 'DRAFT') return;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    parts: prev.parts.filter(
                                                        (part) =>
                                                            part.partName !==
                                                            name
                                                    ),
                                                }));
                                            }}
                                        />
                                    </div>
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
                                    className='flex w-full items-center justify-center bg-indigo-600 transition-colors hover:bg-indigo-700 disabled:bg-gray-400'
                                    disabled={status !== 'DRAFT'}
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
                                    <Button
                                        className='flex w-full items-center justify-center bg-red-600 transition-colors hover:bg-red-700'
                                        onClick={handleDelete}
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
                                        Delete Quote
                                    </Button>
                                )}

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
                                                        handleStatusChange(
                                                            'SENT'
                                                        );
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
                                                            handleStatusChange(
                                                                'APPROVED'
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
                                                        Mark as Approved
                                                    </button>

                                                    <button
                                                        className='flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50'
                                                        onClick={() => {
                                                            handleStatusChange(
                                                                'REJECTED'
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

                                            {status === 'REJECTED' && (
                                                <>
                                                    <button
                                                        className='flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-yellow-800 transition-colors hover:bg-yellow-50'
                                                        onClick={() => {
                                                            handleStatusChange(
                                                                'DRAFT'
                                                            );
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            className='mr-2 h-4 w-4 text-yellow-600'
                                                            viewBox='0 0 20 20'
                                                            fill='currentColor'
                                                        >
                                                            <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                                                        </svg>
                                                        Revert to Draft
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
