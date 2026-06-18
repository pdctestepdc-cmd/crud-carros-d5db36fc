import { Card, Hero, Stat } from "../components";

export default function DashboardPage() {
  return (
    <div className="page">
      <h2 className="page-title">{`Bem-vindo ao CRUD de Carros`}</h2>
      <Hero title={`Gerencie a frota de carros de forma eficiente`} subtitle={`CRUD completo com interface moderna em branco e azul.`} />
      <Card title={`Cadastrar, listar, editar e excluir carros rapidamente.`} subtitle={`Acesse o menu acima para começar.`}>

      </Card>
      <Stat value={`Carros cadastrados`} label={`Veja a lista completa no menu 'Carros'`} />
    </div>
  );
}
