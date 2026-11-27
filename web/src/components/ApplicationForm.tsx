import { useState } from 'react';

import type { FormEvent } from 'react';

import type {
    Application,
    ApplicationRequest
} from '../types/application';

import { ApiError } from '../api/client';

interface ApplicationFormProps {
    application?: Application;
    onSubmit: (request: ApplicationRequest) => Promise<void>;
    onCancel: () => void;
}

export function ApplicationForm({
    application,
    onSubmit,
    onCancel
}: ApplicationFormProps) {

    const [form, setForm] = useState<ApplicationRequest>({
        name: application?.name ?? '',
        description: application?.description ?? '',
        url: application?.url ?? '',
        healthCheckUrl: application?.healthCheckUrl ?? '',
        icon: application?.icon ?? 'server',
        enabled: application?.enabled ?? true
    });

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState('');

    function updateField<K extends keyof ApplicationRequest>(
        field: K,
        value: ApplicationRequest[K]
    ) {

        setForm(previous => ({
            ...previous,
            [field]: value
        }));
    }

    async function handleSubmit(event: FormEvent) {

        event.preventDefault();

        setError('');
        setSubmitting(true);

        try {

            const request: ApplicationRequest = {
                ...form,
                name: form.name.trim(),
                url: form.url.trim(),
                description: form.description?.trim() || null,
                healthCheckUrl: form.healthCheckUrl?.trim() || null
            };

            if (!request.name) {
                throw new Error('Application name is required');
            }

            for (const value of [
                request.url,
                request.healthCheckUrl
            ]) {

                if (value === null) continue;

                const url = new URL(value);

                if (!['http:', 'https:'].includes(url.protocol)) {
                    throw new Error('Only HTTP and HTTPS are supported');
                }
            }

            await onSubmit(request);

        } catch (exception) {

            if (exception instanceof ApiError) {

                setError(
                    exception.status === 409
                        ? 'An application with this name already exists.'
                        : 'Could not save application.'
                );

            } else {

                setError('Check the application name and URLs.');
            }

        } finally {

            setSubmitting(false);
        }
    }

    return (
        <form
            className="application-form"
            onSubmit={handleSubmit}
        >

            <h2>
                {application ? 'Edit application' : 'Add application'}
            </h2>

            <label>
                Application name
                <input
                    value={form.name}
                    maxLength={100}
                    onChange={e =>
                        updateField('name', e.target.value)
                    }
                    required
                />
            </label>

            <label>
                Description
                <textarea
                    value={form.description ?? ''}
                    maxLength={500}
                    onChange={e =>
                        updateField('description', e.target.value)
                    }
                />
            </label>

            <label>
                Application URL
                <input
                    type="url"
                    value={form.url}
                    maxLength={500}
                    onChange={e =>
                        updateField('url', e.target.value)
                    }
                    required
                />
            </label>

            <label>
                Health check URL (optional)
                <input
                    type="url"
                    value={form.healthCheckUrl ?? ''}
                    maxLength={500}
                    onChange={e =>
                        updateField('healthCheckUrl', e.target.value)
                    }
                />
            </label>

            <label>
                Icon
                <select
                    value={form.icon ?? 'server'}
                    onChange={e =>
                        updateField('icon', e.target.value)
                    }
                >
                    <option value="server">Server</option>
                    <option value="wallet">Finance</option>
                    <option value="radar">Radar</option>
                    <option value="database">Database</option>
                    <option value="code">Code</option>
                </select>
            </label>

            <label className="application-checkbox">
                <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={e =>
                        updateField('enabled', e.target.checked)
                    }
                />
                Enabled
            </label>

            {error && (
                <p role="alert" className="application-error">
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
                    {submitting ? 'Saving...' : 'Save application'}
                </button>

            </div>

        </form>
    );
}