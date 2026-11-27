import { useState } from 'react';

import type { FormEvent } from 'react';

import { ApiError } from '../api/client';

interface FileActionDialogProps {
    title: string;
    label: string;
    initialValue?: string;
    allowEmpty?: boolean;
    onSubmit: (value: string) => Promise<void>;
    onCancel: () => void;
}

export function FileActionDialog({
    title,
    label,
    initialValue = '',
    allowEmpty = false,
    onSubmit,
    onCancel
}: FileActionDialogProps) {

    const [value, setValue] = useState(initialValue);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: FormEvent) {

        event.preventDefault();

        setError('');
        setSubmitting(true);

        try {

            if (!allowEmpty && !value.trim()) {
                setError('A value is required.');
                return;
            }

            await onSubmit(value);

        } catch (exception) {

            if (exception instanceof ApiError) {

                switch (exception.status) {

                    case 400:
                        setError('Invalid name or path.');
                        break;

                    case 403:
                        setError('Operation not permitted.');
                        break;

                    case 404:
                        setError('File or directory not found.');
                        break;

                    case 409:
                        setError('An entry with this name already exists.');
                        break;

                    default:
                        setError('Could not complete operation.');
                }

            } else {

                setError('Could not complete operation.');
            }

        } finally {

            setSubmitting(false);
        }
    }

    return (
        <form
            className="file-action-dialog"
            onSubmit={handleSubmit}
        >

            <h2>{title}</h2>

            <label>
                {label}

                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required={!allowEmpty}
                    disabled={submitting}
                />

            </label>

            {error && (
                <p className="file-error" role="alert">
                    {error}
                </p>
            )}

            <div className="form-actions">

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="primary-button"
                    disabled={submitting}
                >
                    {submitting ? 'Processing...' : 'Confirm'}
                </button>

            </div>

        </form>
    );
}