import { useCreate } from "@refinedev/core";
import { Button, Upload, message } from "antd";
import * as XLSX from "xlsx";

const ExcelImport = ({ eventId }: { eventId: string }) => {
  const { mutateAsync: create } = useCreate();

  const handleImport = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const players = jsonData.map((row: any) => ({
        first_name: row.first_name,
        last_name: row.last_name,
        group_name: row.group_name,
        role_id: row.role_id || null,
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

      message.success("Участники успешно импортированы");
    } catch (error) {
      console.error("Ошибка импорта", error);
      message.error("Произошла ошибка при импорте");
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
