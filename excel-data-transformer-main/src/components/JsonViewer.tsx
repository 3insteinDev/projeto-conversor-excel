import { useState, useEffect } from 'react';
import { Check, Copy, Download, Edit2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface JsonViewerProps {
  data: unknown;
  filename?: string;
  editable?: boolean;
  onDataChange?: (data: unknown) => void;
}

export function JsonViewer({ data, filename = 'data.json', editable = false, onDataChange }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJson, setEditedJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const jsonString = JSON.stringify(data, null, 2);

  useEffect(() => {
    setEditedJson(jsonString);
  }, [jsonString]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(isEditing ? editedJson : jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = isEditing ? editedJson : jsonString;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJsonChange = (value: string) => {
    setEditedJson(value);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch {
      setJsonError('JSON inválido');
    }
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(editedJson);
      onDataChange?.(parsed);
      setIsEditing(false);
      setJsonError(null);
      toast.success('JSON atualizado com sucesso!');
    } catch {
      toast.error('JSON inválido. Corrija antes de salvar.');
    }
  };

  const handleCancelEdit = () => {
    setEditedJson(jsonString);
    setIsEditing(false);
    setJsonError(null);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <span className="text-sm font-medium text-foreground">JSON Output</span>
        <div className="flex gap-2">
          {editable && (
            isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-8"
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!!jsonError}
                  className="h-8"
                >
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
            )
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      {isEditing ? (
        <div className="p-4">
          <Textarea
            value={editedJson}
            onChange={(e) => handleJsonChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            spellCheck={false}
          />
          {jsonError && (
            <p className="mt-2 text-sm text-destructive">{jsonError}</p>
          )}
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <pre className="p-4 text-sm font-mono text-foreground">
            {jsonString}
          </pre>
        </ScrollArea>
      )}
    </div>
  );
}
