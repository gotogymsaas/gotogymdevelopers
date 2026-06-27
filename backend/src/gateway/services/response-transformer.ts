export function transformCoachContextSafe(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const context = payload as Record<string, unknown>;
  const wellbeing = context.wellbeing_experience_value_v1;

  return {
    contract: 'gateway.coach_context.safe.v1',
    generated_at: context.generated_at,
    wellbeing_experience_value_v1: wellbeing,
    devices: context.devices,
    business: context.business,
    guardrails: {
      profile_redacted: true,
      documents_text_redacted: true,
      raw_conversations_excluded: true,
    },
  };
}

export function transformCorporateWellbeing(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const data = payload as Record<string, unknown>;
  return {
    contract: 'gateway.corporate_wellbeing.v1',
    generated_at: data.generated_at,
    workspace: data.workspace,
    summary: data.summary,
    active_breaks_corporate: data.active_breaks_corporate,
    corporate_wellbeing_analysis: data.corporate_wellbeing_analysis,
  };
}

export function transformGatewayResponse(transform: 'coach_context_safe' | 'corporate_wellbeing' | 'passthrough', payload: unknown) {
  if (transform === 'coach_context_safe') {
    return transformCoachContextSafe(payload);
  }

  if (transform === 'corporate_wellbeing') {
    return transformCorporateWellbeing(payload);
  }

  return payload;
}
