import { useState } from 'react';
import { Loader2, FileSpreadsheet, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { FileUploader } from '@/components/FileUploader';
import { JsonViewer } from '@/components/JsonViewer';
import { SendProgress } from '@/components/SendProgress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getExcelSheets, convertMultipleSheets, SheetInfo, MultiSheetResult } from '@/lib/excel-converter';
import { cadastroLabels } from '@/types/cadastro';
import { toast } from 'sonner';

export function MultiSheetPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [results, setResults] = useState<MultiSheetResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setResults([]);
    setIsAnalyzing(true);
    
    try {
      const sheetList = await getExcelSheets(file);
      setSheets(sheetList);
      
      const recognizedCount = sheetList.filter(s => s.type).length;
      if (recognizedCount > 0) {
        toast.success(`${recognizedCount} aba(s) reconhecida(s) de ${sheetList.length} total`);
      } else {
        toast.warning('Nenhuma aba reconhecida. Verifique os nomes das abas.');
      }
    } catch (error) {
      console.error('Erro ao analisar arquivo:', error);
      toast.error('Erro ao analisar o arquivo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);
    try {
      const convertedResults = await convertMultipleSheets(selectedFile);
      setResults(convertedResults);
      
      const totalRecords = convertedResults.reduce((sum, r) => sum + r.rowCount, 0);
      toast.success(`${totalRecords} registro(s) convertido(s) em ${convertedResults.length} aba(s)!`);
    } catch (error) {
      console.error('Erro ao converter:', error);
      toast.error('Erro ao processar o arquivo.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSheets([]);
    setResults([]);
  };

  const recognizedSheets = sheets.filter(s => s.type);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8">
        <PageHeader 
          title="Conversão Multi-Abas"
          description="Faça upload de uma planilha com múltiplas abas. As abas serão identificadas pelo nome e convertidas automaticamente."
        />

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              1. Selecione o arquivo Excel
            </h2>
            <FileUploader onFileSelect={handleFileSelect} />
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analisando abas do arquivo...</span>
            </div>
          )}

          {sheets.length > 0 && !isAnalyzing && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                2. Abas encontradas
              </h2>
              <div className="space-y-2">
                {sheets.map((sheet, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{sheet.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({sheet.rowCount} linhas)
                      </span>
                    </div>
                    {sheet.type ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <Badge variant="secondary">
                          {cadastroLabels[sheet.type]}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Não reconhecida</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {recognizedSheets.length > 0 && (
                <div className="mt-4 flex gap-3">
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
                      `Converter ${recognizedSheets.length} aba(s)`
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Limpar
                  </Button>
                </div>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                3. Resultados da conversão
              </h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Clique em "Editar" para modificar o JSON antes de enviar
              </p>
              
              <Tabs defaultValue={results[0]?.type} className="w-full">
                <TabsList className="mb-4 flex-wrap">
                  {results.map((result) => (
                    <TabsTrigger key={result.type} value={result.type}>
                      {cadastroLabels[result.type]} ({result.rowCount})
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {results.map((result, index) => (
                  <TabsContent key={result.type} value={result.type}>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Aba: <strong>{result.sheetName}</strong> • {result.rowCount} registro(s)
                    </p>
                    <JsonViewer 
                      data={result.data} 
                      filename={`${result.type}-${Date.now()}.json`}
                      editable
                      onDataChange={(newData) => {
                        const newResults = [...results];
                        newResults[index] = { ...newResults[index], data: newData as unknown[] };
                        setResults(newResults);
                      }}
                    />
                    <SendProgress type={result.type} data={result.data} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Nomes de abas reconhecidos
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Motorista</Badge>
              <Badge variant="outline">Transportador</Badge>
              <Badge variant="outline">Veiculo</Badge>
              <Badge variant="outline">Participante Fisico</Badge>
              <Badge variant="outline">Participante Juridico</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
