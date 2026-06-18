import { ApiForm } from "../components";
import { Link } from "react-router-dom";
import { carrosService } from "../services/carros.service";

export default function NovoCarroPage() {
  return (
    <div className="page">
      <Link to=".." relative="path" className="btn btn-outline btn-sm back-btn">← Voltar</Link>
      <h2 className="page-title">{`Cadastrar Carro`}</h2>
      <Link className="btn btn-outline" to="/carros" style={{ margin: "0 0 20px 0" }}>{`Voltar para Listagem`}</Link>
      <ApiForm submit={carrosService.create} fields={[{"name":"modelo","label":"Modelo","type":"text","required":true},{"name":"marca","label":"Marca","type":"text","required":true},{"name":"ano","label":"Ano","type":"number","required":true},{"name":"cor","label":"Cor","type":"text","required":true},{"name":"placa","label":"Placa","type":"text","required":true}]} submitLabel={`Salvar Carro`} />
    </div>
  );
}
