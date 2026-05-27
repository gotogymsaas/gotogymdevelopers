import {
  extractAppGoToGymScores,
  extractAppGoToGymUpdatedAt,
} from '../../components/sections/AppGoToGymCardsSection';
import type { CoachContextResponse } from '../services/wellbeingService';

describe('AppGoToGymCardsSection helpers', () => {
  test('extrae scores desde answers del if_snapshot', () => {
    const response: CoachContextResponse = {
      if_snapshot: {
        answers: [
          { question_id: 's_steps', score: 10 },
          { question_id: 's_sleep', value: '8' },
          { question_id: 'unknown', score: 4 },
        ],
      },
    };

    expect(extractAppGoToGymScores(response)).toMatchObject({
      s_steps: 10,
      s_sleep: 8,
    });
  });

  test('extrae scores desde latest_record y payload de bienestar', () => {
    const response: CoachContextResponse = {
      if_snapshot: {
        latest_record: {
          scores: {
            s_stress_inv: 7,
          },
        },
      },
      wellbeing_experience_value_v1: {
        if_variable_payload: {
          responses: [
            { question_id: 's_circadian', score: 1 },
          ],
        },
      },
    };

    expect(extractAppGoToGymScores(response)).toMatchObject({
      s_stress_inv: 7,
      s_circadian: 1,
    });
  });

  test('prioriza responses del payload cuando el endpoint trae datos recientes', () => {
    const response: CoachContextResponse = {
      if_snapshot: {
        scores: {
          s_steps: 10,
        },
      },
      wellbeing_experience_value_v1: {
        generated_at: '2026-05-27T22:30:17.646Z',
        if_variable_payload: {
          responses: [
            { question_id: 's_steps', score: 1 },
          ],
        },
      },
    };

    expect(extractAppGoToGymScores(response)).toMatchObject({
      s_steps: 1,
    });
    expect(extractAppGoToGymUpdatedAt(response)).toBe('2026-05-27T22:30:17.646Z');
  });
});
