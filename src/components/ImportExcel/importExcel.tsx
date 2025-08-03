import { useCreate, useNotification } from "@refinedev/core";
import { Button, Upload } from "antd";
import * as XLSX from "xlsx";

const isExcelFile = (file: File) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
  ];
  const allowedExtensions = [".xlsx", ".xls"];
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExt = allowedExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );
  return hasValidType || hasValidExt;
};

const ExcelImport = ({ eventId }: { eventId: string }) => {
  const { mutateAsync: create } = useCreate();
  const { open } = useNotification();

  const handleImport = async (file: File) => {
    if (!isExcelFile(file)) {
      open?.({
        message: "Неверный формат файла",
        description: "Пожалуйста, выберите файл Excel (.xls или .xlsx)",
        type: "error",
      });
      return;
    }
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
            resource: "players", //???временный endpoint для создания игроков, в последствии нужно будет изменить на 'players/excel'
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

      open?.({
        message: "Участники успешно добавлены",
        type: "success",
      });
    } catch (error: any) {
      open?.({
        message: "Ошибка при добавлении участников",
        type: "error",
      });
    }
  };

  return (
    <Upload
      accept=".xlsx,.xls"
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
