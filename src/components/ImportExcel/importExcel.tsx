import { useCreate, useNotification } from "@refinedev/core";
import { Button, Upload } from "antd";
import * as XLSX from "xlsx";

const ExcelImport = ({ eventId }: { eventId: string }) => {
  const { mutateAsync: create } = useCreate();
  const { open: openNotification } = useNotification();

  const handleImport = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const rowData = jsonData.slice(1);

      const players = rowData.map((row: any) => ({
        first_name: row[0]?.toString().trim() ?? "",
        last_name: row[1]?.toString().trim() ?? "",
        group_name: row[2]?.toString().trim() ?? "",
        role_id:
          row[3] === undefined || row[3] === "" ? undefined : Number(row[3]),
      }));

      await Promise.all(
        players.map((player) =>
          create({
            resource: "players/excel",
            values: player,
            meta: {
              parent: {
                resource: "events",
                id: eventId,
              },
            },
          })
        )
      );

      openNotification?.({
        message: "Участники успешно добавлены",
        type: "success",
      });
    } catch (error: any) {
      openNotification?.({
        message: "Ошибка при добавлении участников",
        type: "error",
      });
    }
  };

  return (
    <Upload
      beforeUpload={(file) => {
        handleImport(file);
        return false;
      }}
      showUploadList={false}
    >
      <Button>Импорт из Excel</Button>
    </Upload>
  );
};

export default ExcelImport;
