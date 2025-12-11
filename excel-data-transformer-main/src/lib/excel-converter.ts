import * as XLSX from 'xlsx';
import type { 
  Motorista, 
  Transportador, 
  Veiculo, 
  ParticipanteFisico, 
  ParticipanteJuridico,
  CadastroType 
} from '@/types/cadastro';

// Helper para converter data do Excel para ISO string ou null
const excelDateToISO = (excelDate: unknown): string | null => {
  if (!excelDate || excelDate === '') return null;
  if (typeof excelDate === 'string') {
    const d = new Date(excelDate);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof excelDate === 'number') {
    const date = XLSX.SSF.parse_date_code(excelDate);
    if (!date || !date.y || !date.m || !date.d) return null;
    return new Date(date.y, date.m - 1, date.d).toISOString();
  }
  return null;
};

// Helper para obter valor ou null
const getValue = <T>(row: Record<string, unknown>, key: string, defaultValue: T | null = null): T | null => {
  const value = row[key];
  if (value === undefined || value === null || value === '') return defaultValue;
  return value as T;
};

// Helper para verificar se o endereço está vazio
const isEnderecoVazio = (endereco: unknown) => {
  if (!endereco) return true;
  return Object.values(endereco).every(
    v => v === '' || v === null || v === undefined
  );
};

export const convertToMotorista = (
  rows: Record<string, unknown>[]
): Motorista[] => {
  // Função para limpar telefone e cpf
  const cleanDigits = (value: string | null) =>
    typeof value === 'string' ? value.replace(/[^\d]/g, '') : '';

  return rows.map((row) => {
    const endereco = {
      logradouro: getValue(row, 'LOGRADOURO', ''),
      numero: getValue(row, 'NUMERO', ''),
      complemento: getValue(row, 'COMPLEMENTO', ''),
      bairro: getValue(row, 'BAIRRO', ''),
      ibgeCidade: getValue(row, 'IBGECIDADE', null),
      cep: getValue(row, 'CEP', ''),
    };

    return {
      nome: getValue(row, 'NOME', ''),
      cpf: cleanDigits(getValue(row, 'CPF', '')),
      rg: getValue(row, 'RG', null),
      inscricaoEstadual: getValue(row, 'INSCRICAOESTADUAL', null),
      dataNascimento: excelDateToISO(getValue(row, 'DATA_NASCIMENTO')),
      latitude: getValue(row, 'LATITUDE', null),
      longitude: getValue(row, 'LONGITUDE', null),
      emissorRG: getValue(row, 'EMISSORRG', null),
      dataEmissaoRG: excelDateToISO(getValue(row, 'DATAEMISSAORG')),
      naturalidade: getValue(row, 'NATURALIDADE', null),
      sexo: getValue(row, 'SEXO', 0),
      ufEmissaoRG: getValue(row, 'UFEMISSAORG', null),
      raca: getValue(row, 'RACA', 1),
      telefone: (() => {
        const numeroRaw = getValue(row, 'TELEFONE', '');
        const numero = cleanDigits(numeroRaw);
        const operadora = getValue(row, 'OPERADORA', null);
        const tipoTelefone = getValue(row, 'TIPO TELEFONE', null);

        if (!numero) return [];
        return [{
          numero,
          operadora,
          tipoTelefone,
        }];
      })(),
      endereco: isEnderecoVazio(endereco) ? null : endereco,
      email: (() => {
        const em = getValue(row, 'EMAIL', []);
        if (Array.isArray(em)) return em;
        if (em === undefined || em === null || em === '') return [];
        return [em];
      })(),
      numeroCnh: getValue(row, 'NUMEROCNH', null),
      numeroSegurancaCnh: getValue(row, 'NUMEROSEGURANCACNH', null),
      categoriaCnh: getValue(row, 'CATEGORIACNH', null),
      validadeCnh: getValue(row, 'VALIDADECNH', '') ? excelDateToISO(row.VALIDADECNH) : '',
      pis: getValue(row, 'PIS', null),
      nomeMae: getValue(row, 'NOMEMAE', null),
      tipoFuncionario: getValue(row, 'TIPOFUNCIONARIO', 1),
      contratante: getValue(row, 'CONTRATANTE', null),
      numeroCartaoCIOT: getValue(row, 'NUMEROCARTÃOCIOT', null),
      dataPrimeiraHabilitacao: excelDateToISO(row.DATAPRIMEIRAHABILITACAO),
      token: getValue(row, 'TOKEN', '') ? [getValue(row, 'TOKEN', '')] : [],
      cartao: row.NUMEROCARTAO ? [{
        idCartao: getValue(row, 'IDCARTAO', 0),
        emissor: getValue(row, 'EMISSORCARTAO', 0),
        tipoCartao: getValue(row, 'TIPOCARTAO', 1),
        numeroCartao: getValue(row, 'NUMEROCARTAO', ''),
        cnpjVinculo: getValue(row, 'CNPJVINCULOCARTAO', ''),
      }] : [],
    };
  });
};

export const convertToTransportador = (rows: Record<string, unknown>[]): Transportador[] => {
  return rows.map((row) => ({
    rntrc: getValue(row, 'RNTRC', ''),
    dataVencimentoRntrc: excelDateToISO(row.DATAVENCIMENTORNTRC),
    tipoProprietario: getValue(row, 'TIPOPROPRIETARIO', 0),
    geraMdfe: getValue(row, 'GERAMDFe', true),
    geracaoTransito: getValue(row, 'GERACAOTRANSITO', 1),
    modal: getValue(row, 'MODAL', 1),
    localGeracaoTransito: getValue(row, 'LOCALGERACAOTRANSITO', 0),
    tipoAverbacao: getValue(row, 'TIPOAVERBACAO', 1),
    valorFixo: getValue(row, 'VALORFIXO', 0),
    dependentes: getValue(row, 'DEPENDENTES', 0),
    tipoEmpresa: getValue(row, 'TIPOEMPRESA', 1),
    transportadoresVinculados: row.transportadorVinculado ? [{
      transportador: getValue(row, 'TRANSPORTADORVINCULADO', ''),
      tipoContrato: getValue(row, 'TIPOCONTRATO', 0),
      frotaTerceira: getValue(row, 'FROTATERCEIRA', true),
      frotaTerceiraContrato: getValue(row, 'FROTATERCEIRACONTRATO', 0),
      mdFe: getValue(row, 'MDFE', 0),
    }] : [],
    cnpjsAutorizados: row.cnpjAutorizado ? [getValue(row, 'CNPJAUTORIZADO', '')] : [],
    observacaoContribuinte: row.observacaoContribuinte ? [getValue(row, 'OBSERVACAOCONTRIBUINTE', '')] : [],
    excecoes: row.tipoServico ? [{
      tipoServico: getValue(row, 'TIPOSERVICO', 0),
      tomador: getValue(row, 'TOMADOR', 0),
    }] : [],
    cartao: row.numeroCartao ? [{
      idCartao: getValue(row, 'IDCARTAO', 0),
      pagamento: getValue(row, 'PAGAMENTO', 1),
      emissor: getValue(row, 'EMISSORCARTAO', 0),
      meioPagamento: getValue(row, 'MEIOPAGAMENTO', 1),
      cnpjVinculo: getValue(row, 'CNPJVINCULOCARTAO', ''),
      instituicaoBancaria: getValue(row, 'INSTITUICAOBANCARIA', 0),
      documentoBeneficiente: getValue(row, 'DOCUMENTOBENEFICIENTE', ''),
      nomeBeneficiente: getValue(row, 'NOMEBENEFICIENTE', ''),
      repassaAdiantamentoMotorista: getValue(row, 'REPASSAADIANTAMENTOMOTORISTA', true),
      tipoChavePix: getValue(row, 'TIPOCHAVEPIX', 0),
      valorChavePix: getValue(row, 'VALORCHAVEPIX', ''),
      numeroCartao: getValue(row, 'NUMEROCARTAO', ''),
      dadosBancarios: {
        instituicaoBancaria: getValue(row, 'INSTITUICAOBANCARIA', 0),
        agencia: getValue(row, 'AGENCIA', ''),
        agenciaDigitoVerificador: getValue(row, 'AGENCIA_DIGITO_VERIFICADOR', ''),
        tipoConta: getValue(row, 'TIPOCONTA', 1),
        conta: getValue(row, 'CONTA', ''),
        contaDigitoVerificador: getValue(row, 'CONTADIGITOVERIFICADOR', ''),
      },
    }] : [],
    condicaoPagamento: getValue(row, 'CONDICAOPAGAMENTO', ''),
    token: getValue(row, 'TOKEN', '') ? [getValue(row, 'TOKEN', '')] : [],
    participanteJuridico: {
      idParticipante: getValue(row, 'IDPARTICIPANTEJURIDICO', 0),
      razaoSocial: getValue(row, 'RAZAOSOCIAL', ''),
      nomeFantasia: getValue(row, 'NOMEFANTASIA', ''),
      cnpj: getValue(row, 'CNPJ', ''),
      inscricaoEstadual: getValue(row, 'INSCRICAOESTADUAL', ''),
      inscricaoMunicipal: getValue(row, 'INSCRICAOMUNICIPAL', ''),
      inscricaoEstadualAvulsa: getValue(row, 'INSCRICAOESTADUALAVULSA', ''),
      porteEmpresa: getValue(row, 'PORTEEMPRESA', 0),
      latitude: getValue(row, 'LATITUDEJURIDICO', ''),
      longitude: getValue(row, 'LONGITUDEJURIDICO', ''),
      tipoContribuinte: getValue(row, 'TIPOCONTRIBUINTE', 0),
      terminal: getValue(row, 'TERMINAL', true),
      terminalCorGrafico: getValue(row, 'TERMINALCORGRAFICO', ''),
      endereco: {
        logradouro: getValue(row, 'LOGRADOURO', ''),
        numero: getValue(row, 'NUMERO', ''),
        complemento: getValue(row, 'COMPLEMENTO', ''),
        bairro: getValue(row, 'BAIRRO', ''),
        ibgeCidade: getValue(row, 'IBGECIDADE', 0),
        cep: getValue(row, 'CEP', ''),
      },
      email: row.email ? [{ email: getValue(row, 'EMAIL', ''), nome: getValue(row, 'NOMEEMAIL', '') }] : [],
      telefone: row.telefone ? [{
        numero: getValue(row, 'TELEFONE', ''),
        operadora: getValue(row, 'OPERADORA', 0),
        tipoTelefone: getValue(row, 'TIPOTELEFONE', 0),
      }] : [],
    },
    participanteFisico: {
      nome: getValue(row, 'NOMEFISICO', ''),
      cpf: getValue(row, 'CPFFISICO', ''),
      rg: getValue(row, 'RGFISICO', ''),
      inscricaoEstadual: getValue(row, 'INSCRICAOESTADUALFISICO', ''),
      dataNascimento: excelDateToISO(row.DATA_NASCIMENTOFISICO),
      latitude: getValue(row, 'LATITUDEFISICO', ''),
      longitude: getValue(row, 'LONGITUDEFISICO', ''),
      emissorRG: getValue(row, 'EMISSORRGFISICO', ''),
      dataEmissaoRG: excelDateToISO(row.DATAEMISSAORG_FISICO),
      naturalidade: getValue(row, 'NATURALIDADEFISICO', ''),
      sexo: getValue(row, 'SEXOFISICO', 0),
      ufEmissaoRG: getValue(row, 'UFEMISSAORGFISICO', 0),
      raca: getValue(row, 'RACAFISICO', 1),
      endereco: {
        logradouro: getValue(row, 'LOGRADOUROFISICO', ''),
        numero: getValue(row, 'NUMEROFISICO', ''),
        complemento: getValue(row, 'COMPLEMENTOFISICO', ''),
        bairro: getValue(row, 'BAIRROFISICO', ''),
        ibgeCidade: getValue(row, 'IBGECIDADEFISICO', 0),
        cep: getValue(row, 'CEPFISICO', ''),
      },
      email: row.emailFisico ? [{ email: getValue(row, 'EMAILFISICO', ''), nome: getValue(row, 'NOMEEMAILFISICO', '') }] : [],
      telefone: row.telefoneFisico ? [{
        numero: getValue(row, 'TELEFONEFISICO', ''),
        operadora: getValue(row, 'OPERADORAFISICO', 0),
        tipoTelefone: getValue(row, 'TIPOTELEFONEFISICO', 0),
      }] : [],
    },
    email: row.emailTransportador ? [{ email: getValue(row, 'EMAILTRANSPORTADOR', ''), nome: getValue(row, 'NOMEEMAILTRANSPORTADOR', '') }] : [],
    telefone: row.telefoneTransportador ? [{
      numero: getValue(row, 'TELEFONETRANSPORTADOR', ''),
      operadora: getValue(row, 'OPERADORATRANSPORTADOR', 0),
      tipoTelefone: getValue(row, 'TIPOTELEFONETRANSPORTADOR', 0),
    }] : [],
    endereco: {
      logradouro: getValue(row, 'LOGRADOUROTRANSPORTADOR', ''),
      numero: getValue(row, 'NUMEROTRANSPORTADOR', ''),
      complemento: getValue(row, 'COMPLEMENTOTRANSPORTADOR', ''),
      bairro: getValue(row, 'BAIRROTRANSPORTADOR', ''),
      ibgeCidade: getValue(row, 'IBGECIDADETRANSPORTADOR', 0),
      cep: getValue(row, 'CEPTRANSPORTADOR', ''),
    },
  }));
};

export const convertToVeiculo = (rows: Record<string, unknown>[]): Veiculo[] => {
  return rows.map((row) => ({
    placa: getValue(row, 'PLACA', ''),
    renavam: getValue(row, 'RENAVAM', null),
    taraKg: getValue(row, 'TARA KG', 0),
    capacidadeKg: getValue(row, 'CAPACIDADE KG', null),
    capacidadeM3: getValue(row, 'CAPACIDADE M3', null),
    tipoRodado: getValue(row, 'TIPO RODADO', 0),
    tipoCarroceria: getValue(row, 'TIPO DE CARROCERIA', 0),
    uf: getValue(row, 'ESTADO', 0),
    tipoVeiculo: getValue(row, 'TIPO VEICULO', 0),
    transportador: getValue(row, 'PROPRIETARIO', ''),
    numeroEixos: getValue(row, 'EIXO', 0),
    numeroEixoSuspenso: getValue(row, 'NUMEROEIXOSUSPENSO', 0),
    anoFabricacao: getValue(row, 'ANO FABRICACAO', null),
    anoModelo: getValue(row, 'ANO MODELO', null),
    chassi: getValue(row, 'CHASSI', ''),
    cor: getValue(row, 'COR', ''),
    marca: getValue(row, 'MARCA', ''),
    modelo: getValue(row, 'MODELO', ''),
    cidade: getValue(row, 'CIDADE', null),
    token: getValue(row, 'TOKEN', '') ? [getValue(row, 'TOKEN', '')] : [],
    agregador: row.agregador ? [getValue(row, 'AGREGADOR', '')] : [],
  }));
};

export const convertToParticipanteFisico = (rows: Record<string, unknown>[]): ParticipanteFisico[] => {
  return rows.map((row) => ({
    nome: getValue(row, 'NOME', ''),
    cpf: getValue(row, 'CPF', ''),
    rg: getValue(row, 'RG', ''),
    inscricaoEstadual: getValue(row, 'INSCRICAOESTADUAL', ''),
    dataNascimento: excelDateToISO(row.DATA_NASCIMENTO),
    latitude: getValue(row, 'LATITUDE', ''),
    longitude: getValue(row, 'LONGITUDE', ''),
    emissorRG: getValue(row, 'EMISSORRG', ''),
    dataEmissaoRG: excelDateToISO(row.DATAEMISSAORG),
    naturalidade: getValue(row, 'NATURALIDADE', ''),
    sexo: getValue(row, 'SEXO', 0),
    ufEmissaoRG: getValue(row, 'UFEMISSAORG', 0),
    raca: getValue(row, 'RACA', 1),
    endereco: {
      logradouro: getValue(row, 'LOGRADOURO', ''),
      numero: getValue(row, 'NUMERO', ''),
      complemento: getValue(row, 'COMPLEMENTO', ''),
      bairro: getValue(row, 'BAIRRO', ''),
      ibgeCidade: getValue(row, 'IBGECIDADE', 0),
      cep: getValue(row, 'CEP', ''),
    },
    email: row.email ? [{ email: getValue(row, 'EMAIL', ''), nome: getValue(row, 'NOMEEMAIL', '') }] : [],
    telefone: row.telefone ? [{
      numero: getValue(row, 'TELEFONE', ''),
      operadora: getValue(row, 'OPERADORA', 0),
      tipoTelefone: getValue(row, 'TIPOTELEFONE', 0),
    }] : [],
    token: getValue(row, 'TOKEN', '') ? [getValue(row, 'TOKEN', '')] : [],
  }));
};

export const convertToParticipanteJuridico = (rows: Record<string, unknown>[]): ParticipanteJuridico[] => {
  return rows.map((row) => ({
    razaoSocial: getValue(row, 'RAZAOSOCIAL', ''),
    nomeFantasia: getValue(row, 'NOMEFANTASIA', ''),
    cnpj: getValue(row, 'CNPJ', ''),
    inscricaoEstadual: getValue(row, 'INSCRICAOESTADUAL', ''),
    inscricaoMunicipal: getValue(row, 'INSCRICAOMUNICIPAL', ''),
    inscricaoEstadualAvulsa: getValue(row, 'INSCRICAOESTADUALAVULSA', ''),
    porteEmpresa: getValue(row, 'PORTEEMPRESA', 0),
    latitude: getValue(row, 'LATITUDE', ''),
    longitude: getValue(row, 'LONGITUDE', ''),
    tipoContribuinte: getValue(row, 'TIPOCONTRIBUINTE', 0),
    terminal: getValue(row, 'TERMINAL', true),
    terminalCorGrafico: getValue(row, 'TERMINALCORGRAFICO', ''),
    endereco: {
      logradouro: getValue(row, 'LOGRADOURO', ''),
      numero: getValue(row, 'NUMERO', ''),
      complemento: getValue(row, 'COMPLEMENTO', ''),
      bairro: getValue(row, 'BAIRRO', ''),
      ibgeCidade: getValue(row, 'IBGECIDADE', 0),
      cep: getValue(row, 'CEP', ''),
    },
    email: row.email ? [{ email: getValue(row, 'EMAIL', ''), nome: getValue(row, 'NOMEEMAIL', '') }] : [],
    telefone: row.telefone ? [{
      numero: getValue(row, 'TELEFONE', ''),
      operadora: getValue(row, 'OPERADORA', 0),
      tipoTelefone: getValue(row, 'TIPOTELEFONE', 0),
    }] : [],
    token: getValue(row, 'TOKEN', '') ? [getValue(row, 'TOKEN', '')] : [],
  }));
};

// Mapeamento de nomes de abas para tipos de cadastro
const sheetNameToType: Record<string, CadastroType> = {
  'motorista': 'motorista',
  'motoristas': 'motorista',
  'transportador': 'transportador',
  'transportadores': 'transportador',
  'veiculo': 'veiculo',
  'veiculos': 'veiculo',
  'veículo': 'veiculo',
  'veículos': 'veiculo',
  'participante fisico': 'participante-fisico',
  'participantes fisicos': 'participante-fisico',
  'participante físico': 'participante-fisico',
  'participantes físicos': 'participante-fisico',
  'participante juridico': 'participante-juridico',
  'participantes juridicos': 'participante-juridico',
  'participante jurídico': 'participante-juridico',
  'participantes jurídicos': 'participante-juridico',
};

export interface SheetInfo {
  name: string;
  type: CadastroType | null;
  rowCount: number;
}

export interface MultiSheetResult {
  sheetName: string;
  type: CadastroType;
  data: unknown[];
  rowCount: number;
}

export const parseExcelFile = async (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData as Record<string, unknown>[]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const getExcelSheets = async (file: File): Promise<SheetInfo[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheets: SheetInfo[] = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          const normalizedName = sheetName.toLowerCase().trim();
          const type = sheetNameToType[normalizedName] || null;
          
          return {
            name: sheetName,
            type,
            rowCount: jsonData.length,
          };
        });
        
        resolve(sheets);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const convertMultipleSheets = async (file: File): Promise<MultiSheetResult[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const results: MultiSheetResult[] = [];
        
        for (const sheetName of workbook.SheetNames) {
          const normalizedName = sheetName.toLowerCase().trim();
          const type = sheetNameToType[normalizedName];
          
          if (type) {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
            
            let convertedData: unknown[];
            switch (type) {
              case 'motorista':
                convertedData = convertToMotorista(rows);
                break;
              case 'transportador':
                convertedData = convertToTransportador(rows);
                break;
              case 'veiculo':
                convertedData = convertToVeiculo(rows);
                break;
              case 'participante-fisico':
                convertedData = convertToParticipanteFisico(rows);
                break;
              case 'participante-juridico':
                convertedData = convertToParticipanteJuridico(rows);
                break;
              default:
                continue;
            }
            
            results.push({
              sheetName,
              type,
              data: convertedData,
              rowCount: convertedData.length,
            });
          }
        }
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const convertExcelToJson = async (
  file: File, 
  type: CadastroType
): Promise<unknown[]> => {
  const rows = await parseExcelFile(file);
  
  switch (type) {
    case 'motorista':
      return convertToMotorista(rows);
    case 'transportador':
      return convertToTransportador(rows);
    case 'veiculo':
      return convertToVeiculo(rows);
    case 'participante-fisico':
      return convertToParticipanteFisico(rows);
    case 'participante-juridico':
      return convertToParticipanteJuridico(rows);
    default:
      throw new Error('Tipo de cadastro inválido');
  }
};
