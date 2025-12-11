import { User, Truck, Car, UserCircle, Building2, Layers } from 'lucide-react';
import { CadastroCard } from '@/components/CadastroCard';
import { useAuth } from "@/contexts/auth-context";

const cadastros = [
	{
		title: 'Multi-Abas',
		description: 'Upload de planilha com múltiplas abas. Converte automaticamente pelo nome da aba.',
		icon: Layers,
		href: '/multi-abas',
		highlight: true,
	},
	{
		title: 'Motorista',
		description: 'Cadastro de motoristas com CNH, dados pessoais e informações de cartão.',
		icon: User,
		href: '/motorista',
	},
	{
		title: 'Transportador',
		description: 'Cadastro completo de transportadores com RNTRC e dados bancários.',
		icon: Truck,
		href: '/transportador',
	},
	{
		title: 'Veículo',
		description: 'Cadastro de veículos com placa, RENAVAM e especificações técnicas.',
		icon: Car,
		href: '/veiculo',
	},
	{
		title: 'Participante Físico',
		description: 'Cadastro de pessoas físicas com CPF e dados de contato.',
		icon: UserCircle,
		href: '/participante-fisico',
	},
	{
		title: 'Participante Jurídico',
		description: 'Cadastro de empresas com CNPJ e informações corporativas.',
		icon: Building2,
		href: '/participante-juridico',
	},
];

const Index = () => {
	const { user, permissions, isLoadingUser, error } = useAuth();

	return (
		<div className="min-h-screen bg-background">
			<div className="container max-w-6xl py-12">
				<header className="mb-12 text-center">
					<h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
						Conversor de Cadastros
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Selecione o tipo de cadastro, faça upload de uma planilha Excel e converta
						automaticamente para o formato JSON esperado pela API.
					</p>
					{/* Exemplo de uso do contexto */}
					{isLoadingUser ? (
						<span className="text-sm text-muted-foreground">Carregando usuário...</span>
					) : user ? (
						<span className="text-sm text-foreground">Bem-vindo,</span>
					) : (
						<span className="text-sm text-muted-foreground">Não autenticado</span>
					)}
					{error && (
						<span className="text-sm text-red-500">{error}</span>
					)}
				</header>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{cadastros.map((cadastro) => (
						<CadastroCard
							key={cadastro.href}
							title={cadastro.title}
							description={cadastro.description}
							icon={cadastro.icon}
							href={cadastro.href}
						/>
					))}
				</div>

				<footer className="mt-16 text-center">
					<p className="text-sm text-muted-foreground">
						Upload de arquivos .xlsx ou .xls • Conversão instantânea para JSON
					</p>
				</footer>
			</div>
		</div>
	);
};

export default Index;
