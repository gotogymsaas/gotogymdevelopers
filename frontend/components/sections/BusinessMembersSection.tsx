import React, { useMemo, useState } from 'react';
import { useCorporateWellbeing } from '../../hooks/useCorporateWellbeing';

type MemberStatus = 'active' | 'invited' | 'inactive';
type OperationalState = 'ok' | 'attention' | 'pending';

interface BusinessMember {
  membershipId: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  status: MemberStatus;
  area: string;
  joinedAt: string;
  lastActivityAt: string;
  onboardingPct: number;
  planAssigned: boolean;
  activeBreaksEnabled: boolean;
  devicesConnected: number;
  operationalState: OperationalState;
}

const businessMembersMock: BusinessMember[] = [
  {
    membershipId: 'mem-001',
    userId: 'usr-001',
    fullName: 'Trabajador A',
    email: 'trabajador.a@empresa.com',
    role: 'Empleado',
    status: 'active',
    area: 'Operaciones',
    joinedAt: '2026-04-10T10:00:00Z',
    lastActivityAt: '2026-06-09T18:30:00Z',
    onboardingPct: 100,
    planAssigned: true,
    activeBreaksEnabled: true,
    devicesConnected: 2,
    operationalState: 'ok',
  },
  {
    membershipId: 'mem-002',
    userId: 'usr-002',
    fullName: 'Trabajador B',
    email: 'trabajador.b@empresa.com',
    role: 'Empleado',
    status: 'active',
    area: 'Administracion',
    joinedAt: '2026-04-14T10:00:00Z',
    lastActivityAt: '2026-06-08T16:10:00Z',
    onboardingPct: 78,
    planAssigned: true,
    activeBreaksEnabled: false,
    devicesConnected: 1,
    operationalState: 'attention',
  },
  {
    membershipId: 'mem-003',
    userId: 'usr-003',
    fullName: 'Trabajador C',
    email: 'trabajador.c@empresa.com',
    role: 'Empleado',
    status: 'invited',
    area: 'Comercial',
    joinedAt: '2026-06-01T10:00:00Z',
    lastActivityAt: '',
    onboardingPct: 35,
    planAssigned: false,
    activeBreaksEnabled: false,
    devicesConnected: 0,
    operationalState: 'pending',
  },
  {
    membershipId: 'mem-004',
    userId: 'usr-004',
    fullName: 'Lider RRHH',
    email: 'rrhh@empresa.com',
    role: 'RRHH',
    status: 'active',
    area: 'Talento Humano',
    joinedAt: '2026-03-20T10:00:00Z',
    lastActivityAt: '2026-06-09T20:20:00Z',
    onboardingPct: 100,
    planAssigned: true,
    activeBreaksEnabled: true,
    devicesConnected: 1,
    operationalState: 'ok',
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const formatPercent = (value: unknown): string => {
  const number = toNumber(value);
  return number === null ? '--' : `${Math.round(number)}%`;
};

const formatDate = (value: string): string => {
  if (!value) {
    return 'Sin actividad';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusLabel: Record<MemberStatus, string> = {
  active: 'Activo',
  invited: 'Invitado',
  inactive: 'Inactivo',
};

const stateLabel: Record<OperationalState, string> = {
  ok: 'Operando',
  attention: 'Revisar',
  pending: 'Pendiente',
};

export const BusinessMembersSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | MemberStatus>('all');
  const { data, loading, error } = useCorporateWellbeing({ days: 30 });

  const workspace = data?.workspace ?? {};
  const sharingPolicy = data?.sharing_policy ?? {};
  const globalWellbeing = data?.global_wellbeing ?? {};
  const activeBreaks = data?.active_breaks_corporate ?? {};
  const coverage = isRecord(activeBreaks.coverage) ? activeBreaks.coverage : {};

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return businessMembersMock.filter(member => {
      const matchesStatus = status === 'all' || member.status === status;
      const matchesQuery = !normalizedQuery
        || member.fullName.toLowerCase().includes(normalizedQuery)
        || member.email.toLowerCase().includes(normalizedQuery)
        || member.area.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const operationalSummary = useMemo(() => {
    const active = businessMembersMock.filter(member => member.status === 'active').length;
    const completed = businessMembersMock.filter(member => member.onboardingPct >= 90).length;
    const withPlan = businessMembersMock.filter(member => member.planAssigned).length;
    const withBreaks = businessMembersMock.filter(member => member.activeBreaksEnabled).length;

    return { active, completed, withPlan, withBreaks };
  }, []);

  return (
    <section className="gtg-business-members">
      <div className="gtg-business-members-hero">
        <div>
          <span className="gtg-business-kicker">Equipo empresa</span>
          <h1>{String(workspace.organization_name ?? 'Miembros empresariales')}</h1>
          <p>
            Directorio operativo para visualizar miembros vinculados, estado de activacion
            y lectura agregada de bienestar sin exponer metricas sensibles individuales.
          </p>
          <div className="gtg-business-members-controls">
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar por nombre, correo o area..."
            />
            <select value={status} onChange={event => setStatus(event.target.value as 'all' | MemberStatus)}>
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="invited">Invitados</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        <aside className="gtg-business-command-card">
          <span>Niveles habilitados</span>
          <strong>1, 2 y 3</strong>
          <p>Directorio, operacion y bienestar agregado. Sin detalle clinico individual.</p>
          <small>Privacidad</small>
          <b>{sharingPolicy.cohort_protected ? 'Cohorte protegida' : 'Datos agregados'}</b>
        </aside>
      </div>

      {error && (
        <div className="gtg-business-state is-error">
          No se pudo consultar bienestar agregado. Mostrando directorio de ejemplo para validar el modulo.
        </div>
      )}

      <div className="gtg-business-members-metrics">
        <article className="gtg-business-metric teal">
          <span>Miembros activos</span>
          <strong>{operationalSummary.active}</strong>
          <small>{businessMembersMock.length} vinculados</small>
        </article>
        <article className="gtg-business-metric gold">
          <span>Onboarding completo</span>
          <strong>{operationalSummary.completed}</strong>
          <small>{formatPercent((operationalSummary.completed / businessMembersMock.length) * 100)}</small>
        </article>
        <article className="gtg-business-metric violet">
          <span>Planes asignados</span>
          <strong>{operationalSummary.withPlan}</strong>
          <small>Entrenamiento o bienestar</small>
        </article>
        <article className="gtg-business-metric green">
          <span>Bienestar agregado</span>
          <strong>{loading ? '--' : formatPercent(globalWellbeing.wellbeing_index_0_100)}</strong>
          <small>{String(globalWellbeing.samples ?? coverage.members_with_activity_7d ?? '--')} muestras</small>
        </article>
      </div>

      <div className="gtg-business-members-layout">
        <article className="gtg-business-panel">
          <div className="gtg-business-panel-head">
            <span>Nivel 1</span>
            <strong>Directorio</strong>
          </div>
          <div className="gtg-business-members-table">
            <div className="gtg-business-members-row is-head">
              <span>Miembro</span>
              <span>Area</span>
              <span>Rol</span>
              <span>Estado</span>
            </div>
            {filteredMembers.map(member => (
              <div className="gtg-business-members-row" key={member.membershipId}>
                <span>
                  <b>{member.fullName}</b>
                  <small>{member.email}</small>
                </span>
                <span>{member.area}</span>
                <span>{member.role}</span>
                <span className={`gtg-business-member-pill is-${member.status}`}>{statusLabel[member.status]}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="gtg-business-panel">
          <div className="gtg-business-panel-head">
            <span>Nivel 2</span>
            <strong>Operacion</strong>
          </div>
          <div className="gtg-business-ops-list">
            {filteredMembers.map(member => (
              <div className={`gtg-business-ops-card is-${member.operationalState}`} key={`${member.membershipId}-ops`}>
                <div>
                  <span>{member.fullName}</span>
                  <b>{stateLabel[member.operationalState]}</b>
                </div>
                <p>Ultima actividad: {formatDate(member.lastActivityAt)}</p>
                <div className="gtg-business-ops-grid">
                  <small>Onboarding <b>{member.onboardingPct}%</b></small>
                  <small>Plan <b>{member.planAssigned ? 'Asignado' : 'Pendiente'}</b></small>
                  <small>Pausas <b>{member.activeBreaksEnabled ? 'Activas' : 'No activas'}</b></small>
                  <small>Fuentes <b>{member.devicesConnected}</b></small>
                </div>
                <div className="gtg-business-ops-track" aria-hidden="true">
                  <i style={{ width: `${member.onboardingPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="gtg-business-members-layout">
        <article className="gtg-business-panel">
          <div className="gtg-business-panel-head">
            <span>Nivel 3</span>
            <strong>Bienestar agregado</strong>
          </div>
          <div className="gtg-business-impact-grid">
            <span>Indice organizacional <b>{formatPercent(globalWellbeing.wellbeing_index_0_100)}</b></span>
            <span>Activacion <b>{formatPercent(globalWellbeing.activation_rate_pct)}</b></span>
            <span>Recurrencia <b>{formatPercent(globalWellbeing.recurrent_rate_pct)}</b></span>
            <span>Muestra <b>{String(globalWellbeing.samples ?? sharingPolicy.member_sample_size ?? '--')}</b></span>
          </div>
          <p className="gtg-business-members-note">
            Esta zona debe mantenerse agregada. El detalle individual de salud o bienestar requiere
            consentimiento explicito, scopes y auditoria.
          </p>
        </article>

        <article className="gtg-business-panel">
          <div className="gtg-business-panel-head">
            <span>Politica de acceso</span>
            <strong>Seguro</strong>
          </div>
          <ul className="gtg-business-action-list">
            <li>Usar `membership_id` o `user_id`, no email como identificador principal.</li>
            <li>Mostrar datos administrativos y operativos, no metricas sensibles individuales.</li>
            <li>Auditar accesos cuando el endpoint real de miembros exista.</li>
          </ul>
        </article>
      </div>
    </section>
  );
};
