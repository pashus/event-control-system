export const actionsByType: Record<string, { value: string; label: string }[]> =
  {
    int: [
      { value: "check", label: "Проверить текущее значение" },
      { value: "decrease", label: "Уменьшить на 1" },
      { value: "increase", label: "Увеличить на 1" },
    ],
    bool: [{ value: "check", label: "Проверка значения true/false" }],
  };
