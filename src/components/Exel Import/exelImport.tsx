import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";

export const ExcelImport = ({ eventId }: { eventId: string | number }) => {
  const handleUpload = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const players = json.map((row: any) => ({
        first_name: row["Имя"] || "",
        last_name: row["Фамилия"] || "",
        group: row["Группа"] || "",
        role_id: row["Роль"] || null,
      }));

      await axios.post(
        `http://localhost:8000/api/v1/events/${eventId}/players/excel`,
        players
      );

      message.success("Участники импортированы");
    } catch (error) {
      console.error(error);
      message.error("Ошибка при импорте");
    }

    return false;
  };

  return (
    <Upload beforeUpload={handleUpload} showUploadList={false}>
      <Button icon={<UploadOutlined />}>Импорт из Excel</Button>
    </Upload>
  );
};
