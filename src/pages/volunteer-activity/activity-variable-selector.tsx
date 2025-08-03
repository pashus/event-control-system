import { Select, Typography } from "antd";
import { useState, useEffect } from "react";

const { Title } = Typography;

export function ActivityVariableSelector({ activity, onVariableChange }: any) {
  const [selectedVar, setSelectedVar] = useState<string>();
  const variables = activity?.act_vars || [];

  useEffect(() => {
    setSelectedVar(undefined);
  }, [activity?.id]);

  return (
    <>
      <Title level={5} style={{ marginTop: 16 }}>
        Выберите переменную:
      </Title>
      <Select
        style={{ width: "100%" }}
        placeholder="Переменная"
        value={selectedVar}
        options={variables.map(([name, type]: [string, number | boolean]) => ({
          value: name,
          label: `${name} (${type})`,
        }))}
        onChange={(name) => {
          setSelectedVar(name);
          const [found] = variables.filter(([n]: [string]) => n === name);
          onVariableChange(found ? { name: found[0], type: found[1] } : null);
        }}
      />
    </>
  );
}
