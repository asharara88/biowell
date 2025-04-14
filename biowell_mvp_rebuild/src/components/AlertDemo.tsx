import React, { useState } from 'react';
import Alert from './Alert';
import Button from './Button';

export default function AlertDemo() {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    show: boolean;
  }>>([]);

  const addAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Math.random().toString(36).substring(7);
    setAlerts(prev => [...prev, { id, type, message, show: true }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissAlert(id);
    }, 5000);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, show: false } : alert
      )
    );

    // Clean up dismissed alerts after animation
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 300);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Alert Examples</h2>

        {/* Alert Controls */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => addAlert('success', 'Operation completed successfully!')}
            variant="primary"
          >
            Show Success
          </Button>
          <Button
            onClick={() => addAlert('error', 'An error occurred. Please try again.')}
            variant="primary"
          >
            Show Error
          </Button>
          <Button
            onClick={() => addAlert('warning', 'Please review your changes before continuing.')}
            variant="primary"
          >
            Show Warning
          </Button>
          <Button
            onClick={() => addAlert('info', 'Your session will expire in 5 minutes.')}
            variant="primary"
          >
            Show Info
          </Button>
        </div>

        {/* Alert Examples */}
        <div className="space-y-4">
          <Alert
            type="success"
            title="Success Alert"
            message="Operation completed successfully!"
            variant="filled"
          />

          <Alert
            type="error"
            title="Error Alert"
            message="An error occurred while processing your request."
            variant="outlined"
          />

          <Alert
            type="warning"
            title="Warning Alert"
            message="Please review your changes before proceeding."
            variant="light"
          />

          <Alert
            type="info"
            title="Info Alert"
            message="Your session will expire in 5 minutes."
            variant="light"
            action={
              <Button size="sm" variant="outline">
                Extend Session
              </Button>
            }
          />
        </div>
      </div>

      {/* Dynamic Alerts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 max-w-md w-full">
        <AnimatePresence>
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              type={alert.type}
              message={alert.message}
              show={alert.show}
              onClose={() => dismissAlert(alert.id)}
              variant="light"
              className="shadow-lg"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}