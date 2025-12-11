import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { FileUploader } from '@/components/FileUploader';
import { JsonViewer } from '@/components/JsonViewer';
import { SendProgress } from '@/components/SendProgress';
import { Button } from '@/components/ui/button';
import { convertExcelToJson } from '@/lib/excel-converter';
import { CadastroType, cadastroLabels } from '@/types/cadastro';
import { toast } from 'sonner';
import { useAuth } from "@/contexts/auth-context";

interface CadastroPageProps {
  type: CadastroType;
}

export function CadastroPage({ type }: CadastroPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonResult, setJsonResult] = useState<unknown[] | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const label = cadastroLabels[type];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setJsonResult(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo Excel primeiro');
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertExcelToJson(selectedFile, type);
      setJsonResult(result);
      toast.success(`${result.length} registro(s) convertido(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao converter:', error);
      toast.error('Erro ao processar o arquivo. Verifique se o formato está correto.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJsonResult(null);
  };

  const { user, permissions, isLoadingUser, error } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <PageHeader 
          title={`Cadastro de ${label}`}
          description={`Faça upload de uma planilha Excel para converter os dados de ${label.toLowerCase()} em formato JSON.`}
        />

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              1. Selecione o arquivo Excel
            </h2>
            <FileUploader onFileSelect={handleFileSelect} />
          </div>

          {selectedFile && (
            <div className="flex gap-3">
              <Button 
                onClick={handleConvert} 
                disabled={isConverting}
                className="flex-1"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Convertendo...
                  </>
                ) : (
                  'Converter para JSON'
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Limpar
              </Button>
            </div>
          )}

          {jsonResult && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                2. Resultado da conversão
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {jsonResult.length} registro(s) encontrado(s) - Clique em "Editar" para modificar o JSON antes de enviar
              </p>
              <JsonViewer 
                data={jsonResult} 
                filename={`${type}-${Date.now()}.json`}
                editable
                onDataChange={(newData) => setJsonResult(newData as unknown[])}
              />
              
              <SendProgress type={type} data={jsonResult} />
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Formato esperado da planilha
            </h3>
            <p className="text-sm text-muted-foreground">
              A primeira linha deve conter os nomes das colunas correspondentes aos campos do cadastro. 
              As colunas disponíveis dependem do tipo de cadastro selecionado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
