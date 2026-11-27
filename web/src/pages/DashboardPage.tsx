import {
    Cpu,
    MemoryStick,
    HardDrive,
    Thermometer,
    Server
} from 'lucide-react';

import { useSystemInfo } from '../hooks/useSystemInfo';

import { MetricCard } from '../components/MetricCard';

import '../styles/dashboard.css';
import { Link } from 'react-router-dom';

import { useApplications } from '../hooks/useApplications';

import { ApplicationCard } from '../components/ApplicationCard';

import '../styles/applications.css';
function formatBytes(bytes: number): string {

    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

    let value = bytes;
    let unit = 0;

    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit++;
    }

    return `${value.toFixed(1)} ${units[unit]}`;
}

export function DashboardPage() {

    const { data, error, isLoading, mutate } = useSystemInfo();
    const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsLoading
    } = useApplications();

    if (isLoading) {
        return <p>Loading system information...</p>;
    }

    if (!data) {

        return (
            <div>
                <p>System information unavailable.</p>

                <button onClick={() => void mutate()}>
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-heading">

                <h1>Dashboard</h1>

                <p>Welcome to your home server</p>

            </div>

            {error && (
                <p role="alert" className="dashboard-warning">
                    Could not refresh system information.
                    Showing the last available data.
                </p>
            )}

            <section className="system-host">

                <Server size={26} />

                <div>
                    <strong>{data.hostName}</strong>

                    <p>
                        {data.operatingSystem} · {data.architecture}
                    </p>
                </div>

            </section>

            <section>

                <h2>System overview</h2>

                <div className="metrics-grid">

                    <MetricCard
                        title="CPU Usage"
                        value={`${data.cpu.usagePercentage.toFixed(1)}%`}
                        description={`${data.cpu.logicalCores} logical cores`}
                        icon={Cpu}
                        percentage={data.cpu.usagePercentage}
                    />

                    <MetricCard
                        title="Memory"
                        value={`${data.memory.usagePercentage.toFixed(1)}%`}
                        description={
                            `${formatBytes(data.memory.usedBytes)} / ` +
                            formatBytes(data.memory.totalBytes)
                        }
                        icon={MemoryStick}
                        percentage={data.memory.usagePercentage}
                    />

                    <MetricCard
                        title="Temperature"
                        value={
                            data.cpu.temperature == null
                                ? 'N/A'
                                : `${data.cpu.temperature.toFixed(1)}°C`
                        }
                        description="CPU temperature"
                        icon={Thermometer}
                    />

                </div>

            </section>

            <section>

                <h2>Storage</h2>

                <div className="metrics-grid">

                    {data.storage.map(storage => (
                        <MetricCard
                            key={storage.mountPoint}
                            title={storage.mountPoint}
                            value={`${storage.usagePercentage.toFixed(1)}%`}
                            description={
                                `${formatBytes(storage.usedBytes)} / ` +
                                formatBytes(storage.totalBytes)
                            }
                            icon={HardDrive}
                            percentage={storage.usagePercentage}
                        />
                    ))}

                </div>

            </section>

            <section>

                <h2>My applications</h2>

                {applicationsLoading && (
                    <p>Loading applications...</p>
                )}

                {applicationsError && (
                    <p>Could not load applications.</p>
                )}

                <div className="applications-grid">

                    {applications
                        ?.filter(application => application.enabled)
                        .map(application => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                            />
                        ))}

                </div>

                <Link
                    to="/applications"
                    className="application-link"
                    style={{ marginTop: '16px' }}
                >
                    Manage applications
                </Link>

            </section>

            <p className="dashboard-timestamp">
                Last updated: {
                    new Date(data.instant).toLocaleTimeString()
                }
            </p>

        </div>
    );
}