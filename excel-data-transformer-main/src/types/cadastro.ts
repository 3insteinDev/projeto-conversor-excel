// Tipos base compartilhados
export interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  ibgeCidade: number;
  cep: string;
}

export interface Email {
  email: string;
  nome: string;
}

export interface Telefone {
  numero: string;
  operadora: number;
  tipoTelefone: number;
}

// Motorista
export interface CartaoMotorista {
  idCartao: number;
  emissor: number;
  tipoCartao: number;
  numeroCartao: string;
  cnpjVinculo: string;
}

export interface Motorista {
  nome: string;
  cpf: string;
  rg: string;
  inscricaoEstadual: string;
  dataNascimento: string;
  latitude: string;
  longitude: string;
  emissorRG: string;
  dataEmissaoRG: string;
  naturalidade: string;
  sexo: number;
  ufEmissaoRG: number;
  raca: number;
  endereco: Endereco;
  email: Email[];
  telefone: Telefone[];
  numeroCnh: string;
  numeroSegurancaCnh: string;
  categoriaCnh: string;
  validadeCnh: string;
  pis: string;
  nomeMae: string;
  tipoFuncionario: number;
  contratante: string;
  numeroCartaoCIOT: string;
  dataPrimeiraHabilitacao: string;
  token: string[];
  cartao: CartaoMotorista[];
}

// Transportador
export interface TransportadorVinculado {
  transportador: string;
  tipoContrato: number;
  frotaTerceira: boolean;
  frotaTerceiraContrato: number;
  mdFe: number;
}

export interface Excecao {
  tipoServico: number;
  tomador: number;
}

export interface DadosBancarios {
  instituicaoBancaria: number;
  agencia: string;
  agenciaDigitoVerificador: string;
  tipoConta: number;
  conta: string;
  contaDigitoVerificador: string;
}

export interface CartaoTransportador {
  idCartao: number;
  pagamento: number;
  emissor: number;
  meioPagamento: number;
  cnpjVinculo: string;
  instituicaoBancaria: number;
  documentoBeneficiente: string;
  nomeBeneficiente: string;
  repassaAdiantamentoMotorista: boolean;
  tipoChavePix: number;
  valorChavePix: string;
  numeroCartao: string;
  dadosBancarios: DadosBancarios;
}

export interface ParticipanteJuridicoEmbed {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  inscricaoEstadualAvulsa: string;
  porteEmpresa: number;
  latitude: string;
  longitude: string;
  tipoContribuinte: number;
  terminal: boolean;
  terminalCorGrafico: string;
  endereco: Endereco;
  email: Email[];
  telefone: Telefone[];
}

export interface ParticipanteFisicoEmbed {
  nome: string;
  cpf: string;
  rg: string;
  inscricaoEstadual: string;
  dataNascimento: string;
  latitude: string;
  longitude: string;
  emissorRG: string;
  dataEmissaoRG: string;
  naturalidade: string;
  sexo: number;
  ufEmissaoRG: number;
  raca: number;
  endereco: Endereco;
  email: Email[];
  telefone: Telefone[];
}

export interface Transportador {
  rntrc: string;
  dataVencimentoRntrc: string;
  tipoProprietario: number;
  geraMdfe: boolean;
  geracaoTransito: number;
  modal: number;
  localGeracaoTransito: number;
  tipoAverbacao: number;
  valorFixo: number;
  dependentes: number;
  tipoEmpresa: number;
  transportadoresVinculados: TransportadorVinculado[];
  cnpjsAutorizados: string[];
  observacaoContribuinte: string[];
  excecoes: Excecao[];
  cartao: CartaoTransportador[];
  condicaoPagamento: string;
  token: string[];
  participanteJuridico: ParticipanteJuridicoEmbed;
  participanteFisico: ParticipanteFisicoEmbed;
  email: Email[];
  telefone: Telefone[];
  endereco: Endereco;
}

// Veículo
export interface Veiculo {
  placa: string;
  renavam: string;
  taraKg: number;
  capacidadeKg: number;
  capacidadeM3: number;
  tipoRodado: number;
  tipoCarroceria: number;
  uf: number;
  tipoVeiculo: number;
  transportador: string;
  numeroEixos: number;
  numeroEixoSuspenso: number;
  anoFabricacao: number;
  anoModelo: number;
  chassi: string;
  cor: string;
  marca: string;
  modelo: string;
  cidade: number;
  token: string[];
  agregador: string[];
}

// Participante Físico
export interface ParticipanteFisico {
  nome: string;
  cpf: string;
  rg: string;
  inscricaoEstadual: string;
  dataNascimento: string;
  latitude: string;
  longitude: string;
  emissorRG: string;
  dataEmissaoRG: string;
  naturalidade: string;
  sexo: number;
  ufEmissaoRG: number;
  raca: number;
  endereco: Endereco;
  email: Email[];
  telefone: Telefone[];
  token: string[];
}

// Participante Jurídico
export interface ParticipanteJuridico {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  inscricaoEstadualAvulsa: string;
  porteEmpresa: number;
  latitude: string;
  longitude: string;
  tipoContribuinte: number;
  terminal: boolean;
  terminalCorGrafico: string;
  endereco: Endereco;
  email: Email[];
  telefone: Telefone[];
  token: string[];
}

export type CadastroType = 'motorista' | 'transportador' | 'veiculo' | 'participante-fisico' | 'participante-juridico';

export const cadastroLabels: Record<CadastroType, string> = {
  'motorista': 'Motorista',
  'transportador': 'Transportador',
  'veiculo': 'Veículo',
  'participante-fisico': 'Participante Físico',
  'participante-juridico': 'Participante Jurídico',
};
