import { useDeleteMany } from "@refinedev/core";
import React, { useState } from "react";

export const useItemsDelete = (resource: string, parentMeta?: any) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { mutate, isPending, error } = useDeleteMany();

  const itemsDelete = () => {
    mutate(
      {
        resource,
        ids: selectedRowKeys as number[],
        ...(parentMeta ? { meta: parentMeta } : {}),
      },
      {
        onSuccess: () => setSelectedRowKeys([]),
      }
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return {
    selectedRowKeys,
    rowSelection,
    itemsDelete,
    isPending,
    error,
  };
};
