import { useEffect, useMemo, useState } from 'react';
import type {
  ApplicationFormInput,
  ApplicationScope,
  DeveloperApplication,
} from '../types/types';
import {
  createApplication,
  disableApplication,
  listApplications,
  regenerateClientSecret,
  updateApplication,
} from '../src/services/applicationsService';

export const APPLICATION_SCOPE_OPTIONS: ApplicationScope[] = [
  'integrations:read:application',
  'integrations:sync:application',
  'coach_context:read:application',
  'smartwatch:read:application',
  'corporate_wellbeing:read:application',
  'webhooks:manage:application',
];

export const emptyApplicationForm: ApplicationFormInput = {
  name: '',
  description: '',
  authorizedScopes: ['integrations:read:application'],
};

export function useApplications() {
  const [applications, setApplications] = useState<DeveloperApplication[]>([]);
  const [form, setForm] = useState<ApplicationFormInput>(emptyApplicationForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestSecret, setLatestSecret] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listApplications()
      .then(data => {
        if (mounted) {
          setApplications(data);
          setError(null);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('No se pudieron cargar las aplicaciones.');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = useMemo(
    () => applications.filter(application => application.status === 'active').length,
    [applications],
  );

  const startEdit = (application: DeveloperApplication) => {
    setEditingId(application.id);
    setLatestSecret(null);
    setForm({
      name: application.name,
      description: application.description ?? '',
      authorizedScopes: [...application.authorizedScopes],
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setLatestSecret(null);
    setForm(emptyApplicationForm);
  };

  const setScope = (scope: ApplicationScope, enabled: boolean) => {
    setForm(current => {
      const nextScopes = enabled
        ? Array.from(new Set([...current.authorizedScopes, scope]))
        : current.authorizedScopes.filter(currentScope => currentScope !== scope);

      return {
        ...current,
        authorizedScopes: nextScopes.length > 0 ? nextScopes : current.authorizedScopes,
      };
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateApplication(editingId, form);
        setApplications(current => current.map(application => application.id === editingId ? updated : application));
        resetForm();
        return;
      }

      const created = await createApplication(form);
      const { clientSecret, ...publicApplication } = created;
      setApplications(current => [publicApplication, ...current]);
      setLatestSecret(clientSecret);
      setEditingId(publicApplication.id);
    } catch {
      setError('No se pudo guardar la aplicacion. Revisa nombre y scopes.');
    } finally {
      setSaving(false);
    }
  };

  const disable = async (id: string) => {
    const updated = await disableApplication(id);
    setApplications(current => current.map(application => application.id === id ? updated : application));
  };

  const regenerateSecret = async (id: string) => {
    const updated = await regenerateClientSecret(id);
    const { clientSecret, ...publicApplication } = updated;
    setApplications(current => current.map(application => application.id === id ? publicApplication : application));
    setLatestSecret(clientSecret);
    setEditingId(id);
  };

  return {
    activeCount,
    applications,
    editingId,
    error,
    form,
    latestSecret,
    loading,
    saving,
    resetForm,
    save,
    setForm,
    setScope,
    startEdit,
    disable,
    regenerateSecret,
  };
}

