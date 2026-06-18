import React from "react";

export interface Column {
  key: string;
  label?: string;
}

export interface EditField {
  name: string;
  label?: string;
  type?: string;
}

export function DataTable(props: {
  load: () => Promise<unknown>;
  columns: Column[];
  idKey?: string;
  fields?: EditField[];
  onUpdate?: (id: string | number, body: Record<string, unknown>) => Promise<unknown>;
  onDelete?: (id: string | number) => Promise<unknown>;
}) {
  const idKey = props.idKey ?? "id";
  const canEdit = Boolean(props.onUpdate);
  const canDelete = Boolean(props.onDelete);
  const hasActions = canEdit || canDelete;
  
  const editFields: EditField[] =
    props.fields && props.fields.length > 0
      ? props.fields
      : props.columns
          .filter((c) => c.key !== idKey)
          .map((c) => ({ name: c.key, label: c.label }));

  const [rows, setRows] = React.useState<Record<string, unknown>[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | number | null>(null);
  const [draft, setDraft] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  const reload = React.useCallback(() => {
    setLoading(true);
    return props
      .load()
      .then((data) => {
        setRows(Array.isArray(data) ? (data as Record<string, unknown>[]) : []);
        setError(null);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [props.load]);

  // Um único useEffect — chama reload ao montar e quando props.load mudar
  React.useEffect(() => {
    void reload();
  }, [reload]);

  const startEdit = (row: Record<string, unknown>) => {
    const next: Record<string, string> = {};
    for (const f of editFields) {
      const v = row[f.name];
      next[f.name] = v == null ? "" : String(v);
    }
    setDraft(next);
    setEditingId(row[idKey] as string | number);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async (id: string | number) => {
    if (!props.onUpdate) return;
    setBusy(true);
    try {
      await props.onUpdate(id, draft);
      cancelEdit();
      await reload();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string | number) => {
    if (!props.onDelete) return;
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    setBusy(true);
    try {
      await props.onDelete(id);
      await reload();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  const renderCellContent = (value: unknown, key: string) => {
    const str = value == null ? "" : String(value);
    const keyLower = key.toLowerCase();
    
    // Formata campos de status/ativo com badges coloridos
    if (
      keyLower === "status" ||
      keyLower === "ativo" ||
      keyLower === "active" ||
      keyLower === "situacao" ||
      keyLower === "situacão" ||
      keyLower === "role"
    ) {
      const strLower = str.toLowerCase();
      let badgeCls = "badge-default";
      if (/(ativo|active|pago|sucesso|concluido|concluído|finalizado|sim|yes|true|ok|admin)/.test(strLower)) {
        badgeCls = "badge-success";
      } else if (/(pendente|espera|processando|aguardando|em analise|warning|user)/.test(strLower)) {
        badgeCls = "badge-warning";
      } else if (/(inativo|cancelado|erro|falha|recusado|excluido|nao|não|false|no)/.test(strLower)) {
        badgeCls = "badge-danger";
      }
      return <span className={`badge ${badgeCls}`}>{str}</span>;
    }
    
    return str;
  };

  if (loading) {
    return (
      <div className="table-wrap empty-state" style={{ padding: "40px" }}>
        <p className="muted" style={{ fontWeight: 600 }}>Carregando dados…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-wrap empty-state" style={{ padding: "40px" }}>
        <p className="error" style={{ fontWeight: 600 }}>Erro ao carregar dados: {error}</p>
        <button className="btn btn-outline btn-sm" style={{ marginTop: "12px" }} onClick={reload}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="table-wrap empty-state">
        <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5m16 0h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-2.122a1 1 0 01-.707-.293l-1.414-1.414a1 1 0 00-.707-.293H4"
          />
        </svg>
        <h3 className="empty-state-title">Nenhum registro encontrado</h3>
        <p className="empty-state-desc">
          Ainda não há dados salvos para este recurso. Use o formulário de cadastro para adicionar novos itens.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {props.columns.map((c) => (
              <th key={c.key}>{c.label ?? c.key}</th>
            ))}
            {hasActions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const id = row[idKey] as string | number;
            const isEditing = editingId != null && id === editingId;
            return (
              <tr key={(id as React.Key) ?? i}>
                {props.columns.map((c) => {
                  const editable =
                    isEditing &&
                    c.key !== idKey &&
                    editFields.some((f) => f.name === c.key);
                  return (
                    <td key={c.key}>
                      {editable ? (
                        <input
                          className="table-input"
                          value={draft[c.key] ?? ""}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, [c.key]: e.target.value }))
                          }
                        />
                      ) : (
                        renderCellContent(row[c.key], c.key)
                      )}
                    </td>
                  );
                })}
                {hasActions && (
                  <td className="row-actions">
                    {isEditing ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          disabled={busy}
                          onClick={() => void saveEdit(id)}
                        >
                          Salvar
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          type="button"
                          disabled={busy}
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        {canEdit && (
                          <button
                            className="btn btn-secondary btn-sm"
                            type="button"
                            disabled={busy}
                            onClick={() => startEdit(row)}
                          >
                            Editar
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="btn btn-outline btn-sm"
                            type="button"
                            disabled={busy}
                            onClick={() => void remove(id)}
                          >
                            Excluir
                          </button>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
