import { DataTable } from "../components";
import { Link } from "react-router-dom";
import { carrosService } from "../services/carros.service";

export default function CarrosPage() {
  return (
    <div className="page">
      <Link to=".." relative="path" className="btn btn-outline btn-sm back-btn">← Voltar</Link>
      <h2 className="page-title">{`Listagem de Carros`}</h2>
      <div className="container-block">
        <Link className="btn btn-primary" to="/carros/novo" style={{ margin: "0 0 16px 0" }}>{`Novo Carro`}</Link>
      </div>
      <DataTable load={carrosService.list} columns={[{"key":"modelo","label":"Modelo"},{"key":"marca","label":"Marca"},{"key":"ano","label":"Ano"},{"key":"cor","label":"Cor"},{"key":"placa","label":"Placa"}]} idKey={"id"} fields={[{"name":"modelo","label":"Modelo","type":"text","required":true},{"name":"marca","label":"Marca","type":"text","required":true},{"name":"ano","label":"Ano","type":"number","required":true},{"name":"cor","label":"Cor","type":"text","required":true},{"name":"placa","label":"Placa","type":"text","required":true}]} onUpdate={carrosService.update} onDelete={carrosService.remove} />
    </div>
  );
}
