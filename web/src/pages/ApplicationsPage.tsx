import { useState } from 'react';

import { Plus, Layers } from 'lucide-react';

import { useApplications } from '../hooks/useApplications';

import {
    createApplication,
    updateApplication,
    deleteApplication
} from '../api/applications';

import { ApplicationCard } from '../components/ApplicationCard';
import { ApplicationForm } from '../components/ApplicationForm';

import type {
    Application,
    ApplicationRequest
} from '../types/application';

import '../styles/applications.css';

export function ApplicationsPage() {

    const {
        data,
        error,
        isLoading,
        mutate
    } = useApplications();

    const [formOpen, setFormOpen] = useState(false);

    const [selectedApplication, setSelectedApplication] =
        useState<Application | undefined>(undefined);

    const [actionError, setActionError] = useState('');

    function handleCreate() {

        setSelectedApplication(undefined);
        setActionError('');
        setFormOpen(true);
    }

    function handleEdit(application: Application) {

        setSelectedApplication(application);
        setActionError('');
        setFormOpen(true);
    }

    function closeForm() {

        setFormOpen(false);
        setSelectedApplication(undefined);
    }

    async function handleSave(request: ApplicationRequest) {

        setActionError('');

        if (selectedApplication) {

            await updateApplication(
                selectedApplication.id,
                request
            );

        } else {

            await createApplication(request);
        }

        closeForm();

        await mutate();
    }

    async function handleDelete(application: Application) {

        const confirmed = window.confirm(
            `Delete "${application.name}"?`
        );

        if (!confirmed) return;

        setActionError('');

        try {

            await deleteApplication(application.id);

            await mutate();

        } catch {

            setActionError('Could not delete application.');
        }
    }

    return (
        <div className="applications-page">

            <div className="applications-heading">

                <div>
                    <h1>Applications</h1>
                    <p>Manage your self-hosted services.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={handleCreate}
                    disabled={formOpen}
                >
                    <Plus size={18} />
                    Add application
                </button>

            </div>

            {actionError && (
                <p role="alert" className="application-error">
                    {actionError}
                </p>
            )}

            {formOpen && (
                <ApplicationForm
                    key={selectedApplication?.id ?? 'new'}
                    application={selectedApplication}
                    onSubmit={handleSave}
                    onCancel={closeForm}
                />
            )}

            {isLoading && (
                <p>Loading applications...</p>
            )}

            {error && (
                <div className="application-error">
                    Could not load applications.

                    <button
                        className="secondary-button"
                        onClick={() => void mutate()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {data?.length === 0 && (
                <div className="applications-empty">
                    <Layers size={40} />
                    <h2>No applications registered</h2>
                    <p>Add your first self-hosted service.</p>
                </div>
            )}

            <div className="applications-grid">

                {data?.map(application => (
                    <ApplicationCard
                        key={application.id}
                        application={application}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}

            </div>

        </div>
    );
}