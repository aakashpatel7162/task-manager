import React, { useState } from 'react';
import { useTaskContext } from './TaskContext';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ImportExportModal: React.FC = () => {
  const { isImportModalOpen, closeImportModal, importData } = useTaskContext();
  const [jsonText, setJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isImportModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!jsonText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste JSON or upload a file first.' });
      return;
    }

    const res = importData(jsonText);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `Successfully imported ${res.count} tasks!`,
      });
      setTimeout(() => {
        closeImportModal();
        setStatusMessage(null);
        setJsonText('');
      }, 1200);
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Failed to import JSON data.',
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="#0284c7" />
            <h2 className="modal-title">Import Tasks JSON</h2>
          </div>
          <button
            type="button"
            onClick={closeImportModal}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Upload a valid TaskFlow backup JSON file or paste its raw JSON content below. This will replace the current dataset.
          </p>

          <div className="form-group">
            <label className="form-label">
              Choose JSON File
            </label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="text-input"
              style={{ padding: '0.4rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Or Paste JSON Content
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='[ { "id": "...", "title": "...", "status": "todo", ... } ]'
              rows={6}
              className="text-area"
              style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
            />
          </div>

          {statusMessage && (
            <div className={`alert-message ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={closeImportModal}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="btn-primary"
          >
            Confirm Import
          </button>
        </div>
      </div>
    </div>
  );
};
