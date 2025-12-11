import { env } from '@/constants/env';
import { Motorista, Transportador, Veiculo, ParticipanteFisico, ParticipanteJuridico, CadastroType } from '@/types/cadastro';
import { fetcher } from './shared/fetcher';

export interface SendResult {
  index: number;
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface SendProgress {
  total: number;
  current: number;
  results: SendResult[];
}

const TYPE_ENDPOINTS: Record<CadastroType, string> = {
  motorista: 'Motorista',
  transportador: 'Transportador',
  veiculo: 'Veiculo',
  'participante-fisico': 'ParticipanteFisico',
  'participante-juridico': 'ParticipanteJuridico',
};

export async function sendItem(
  type: CadastroType,
  item: Motorista | Transportador | Veiculo | ParticipanteFisico | ParticipanteJuridico,
  grupoToken?: string[]
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const endpoint = TYPE_ENDPOINTS[type];
  const url = `${env.GESTAO_CADASTRO_API}/api/app/v1/${endpoint}`;

  const itemWithToken = grupoToken ? { ...item, token: grupoToken } : item;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const data = await fetcher(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(itemWithToken),
      authRequired: true,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
}

export async function sendAllItems(
  type: CadastroType,
  items: unknown[],
  grupoToken?: string[],
  onProgress?: (progress: SendProgress) => void 
): Promise<SendResult[]> {
  const results: SendResult[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Motorista | Transportador | Veiculo | ParticipanteFisico | ParticipanteJuridico;
    const result = await sendItem(type, item, grupoToken);

    results.push({
      index: i,
      success: result.success,
      data: result.data,
      error: result.error,
    });

    onProgress?.({
      total: items.length,
      current: i + 1,
      results: [...results],
    });
  }

  return results;
}
