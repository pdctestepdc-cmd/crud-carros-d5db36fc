import React from "react";

export interface FormField {
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

export function ApiForm(props: {
  submit: (body: Record<string, unknown>) => Promise<unknown>;
  fields: FormField[];
  submitLabel?: string;
}) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = React.useState<string>("");

  const update = (name: string, value: string) => {
    // Limpa feedback ao começar a editar de novo
    if (status !== "idle" && status !== "sending") setStatus("idle");
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      await props.submit(values);
      setStatus("ok");
      setMessage("Cadastro realizado com sucesso!");
      setValues({});
    } catch (err) {
      setStatus("error");
      setMessage(String(err));
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-grid">
        {props.fields.map((f) => {
          const isTextarea = f.type === "textarea";
          const gridClass = isTextarea ? "field field-span-2" : "field";
          return (
            <label key={f.name} className={gridClass}>
              <span className="field-label">
                {f.label ?? f.name}
                {f.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
              </span>
              {isTextarea ? (
                <textarea
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  rows={4}
                />
              ) : f.type === "checkbox" ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <input
                    type="checkbox"
                    required={f.required}
                    checked={values[f.name] === "true"}
                    onChange={(e) => update(f.name, String(e.target.checked))}
                    style={{ width: "18px", height: "18px", margin: 0, cursor: "pointer" }}
                  />
                  <span className="muted" style={{ fontSize: "0.85rem" }}>Marcar se aplicável</span>
                </div>
              ) : (
                <input
                  type={f.type ?? "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                />
              )}
            </label>
          );
        })}
      </div>

      <button className="btn btn-primary" type="submit" disabled={status === "sending"} style={{ alignSelf: "flex-start", marginTop: "8px" }}>
        {status === "sending" ? "Enviando…" : (props.submitLabel ?? "Salvar Cadastro")}
      </button>

      {status === "ok" && (
        <div className="alert-banner alert-banner-success">
          <svg className="alert-banner-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="alert-banner alert-banner-error">
          <svg className="alert-banner-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
