import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { CadastroPage } from "./pages/CadastroPage";
import { MultiSheetPage } from "./pages/MultiSheetPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/multi-abas" element={<MultiSheetPage />} />
          <Route path="/motorista" element={<CadastroPage type="motorista" />} />
          <Route path="/transportador" element={<CadastroPage type="transportador" />} />
          <Route path="/veiculo" element={<CadastroPage type="veiculo" />} />
          <Route path="/participante-fisico" element={<CadastroPage type="participante-fisico" />} />
          <Route path="/participante-juridico" element={<CadastroPage type="participante-juridico" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
