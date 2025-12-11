import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Send, Loader2 } from 'lucide-react';
import { CadastroType } from '@/types/cadastro';
import { sendAllItems, SendProgress as SendProgressType, SendResult } from '@/lib/api-service';

interface SendProgressProps {
  type: CadastroType;
  data: unknown[];
  onComplete?: (results: SendResult[]) => void;
}

export function SendProgress({ type, data, onComplete }: SendProgressProps) {
  const [grupoToken, setGrupoToken] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState<SendProgressType | null>(null);
  const [results, setResults] = useState<SendResult[] | null>(null);

  const handleSend = async () => {
    setIsSending(true);
    setProgress(null);
    setResults(null);

    const finalResults = await sendAllItems(
      type, 
      data, 
      grupoToken.trim() ? [grupoToken.trim()] : [undefined],
      setProgress
    );
    
    setResults(finalResults);
    setIsSending(false);
    onComplete?.(finalResults);
  };

  const successCount = results?.filter(r => r.success).length ?? 0;
  const errorCount = results?.filter(r => !r.success).length ?? 0;
  const progressPercent = progress ? (progress.current / progress.total) * 100 : 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Enviar para API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">          
          <div className="space-y-2">
            <Label htmlFor="grupoToken">Grupo Token</Label>
            <Input
              id="grupoToken"
              placeholder="Digite o token do grupo..."
              value={grupoToken}
              onChange={(e) => setGrupoToken(e.target.value)}
              disabled={isSending}
            />
            <p className="text-xs text-muted-foreground">
              Será adicionado em cada item no campo "Token"
            </p>
          </div>
        </div>

        <Button onClick={handleSend} disabled={isSending} className="w-full">
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar {data.length} registro(s)
            </>
          )}
        </Button>

        {(isSending || results) && (
          <div className="space-y-3">
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                {progress?.current ?? results?.length ?? 0} / {data.length}
              </span>
              {results && (
                <>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {successCount} sucesso
                  </Badge>
                  {errorCount > 0 && (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      {errorCount} erros
                    </Badge>
                  )}
                </>
              )}
            </div>

            {results && results.length > 0 && (
              <ScrollArea className="h-48 rounded border">
                <div className="p-3 space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.index}
                      className={`flex items-center gap-2 p-2 rounded text-sm ${
                        result.success ? 'bg-green-500/10' : 'bg-destructive/10'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                      <span>Item {result.index + 1}</span>
                      {result.error && (
                        <span className="text-destructive text-xs ml-2">{result.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
