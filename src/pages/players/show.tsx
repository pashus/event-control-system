import { api } from "@/api";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  TeamOutlined,
} from "@ant-design/icons";
import {
  DeleteButton,
  EditButton,
  ListButton,
  Show,
  TextField,
} from "@refinedev/antd";
import { useMany, useNotification, useOne, useShow } from "@refinedev/core";
import { Button, Card, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const { Title, Text } = Typography;

export const PlayerShow = () => {
  const { eventId } = useParams();
  const { open } = useNotification();
  const { query } = useShow({
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const [isPresent, setIsPresent] = useState(record?.is_present);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [activityVars, setActivityVars] = useState<{ activity_id: string }[]>(
    []
  );

  useEffect(() => {
    const fetchQr = async () => {
      if (!record?.id || !eventId) return;
      try {
        const response = await api.get(
          `/events/${eventId}/players/${record.id}/qr-code/`,
          { responseType: "blob" }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setQrCodeUrl(imageUrl);
      } catch (error) {
        open?.({
          type: "error",
          message: "Ошибка при получении QR-кода",
        });
      }
    };

    const fetchActivityVars = async () => {
      if (!record?.id || !eventId) return;
      try {
        const res = await api.get(
          `/events/${eventId}/players/${record.id}/vars/`
        );
        setActivityVars(Array.isArray(res.data) ? res.data : []);
      } catch {
        open?.({
          type: "error",
          message: "Ошибка при получении значений активностей",
        });
      }
    };

    fetchQr();
    fetchActivityVars();
  }, [record?.id, eventId]);

  useEffect(() => {
    if (record?.is_present !== undefined) {
      setIsPresent(record.is_present);
    }
  }, [record?.is_present]);

  const handleCheckIn = async () => {
    try {
      await api.post(`/events/${eventId}/players/${record?.id}/check-in/`);
      open?.({
        type: "success",
        message: "Участник отмечен",
      });
      setIsPresent(true);
    } catch (error) {
      open?.({
        type: "error",
        message: "Ошибка при отметке",
      });
    }
  };

  const { data: roleData, isLoading: isRoleLoading } = useOne({
    resource: "roles",
    id: record?.role_id,
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
    queryOptions: {
      enabled: !!record?.role_id,
    },
  });

  const activityIds = activityVars?.map((v) => v.activity_id) || [];

  const { data: activitiesData } = useMany({
    resource: "activities",
    ids: activityIds,
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
    queryOptions: {
      enabled: activityIds.length > 0,
    },
  });

  return (
    <Show
      title={`Участник: ${record?.first_name || ""} ${record?.last_name || ""}`}
      isLoading={isLoading && isRoleLoading}
      headerButtons={({
        deleteButtonProps,
        editButtonProps,
        listButtonProps,
      }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps} icon={<TeamOutlined />} />
          )}
          {editButtonProps && <EditButton {...editButtonProps} />}
          {deleteButtonProps && (
            <DeleteButton
              {...deleteButtonProps}
              meta={{
                parent: {
                  resource: "events",
                  id: eventId,
                },
              }}
            />
          )}
        </>
      )}
      footerButtons={
        isPresent
          ? undefined
          : () => (
              <Button onClick={handleCheckIn} type="primary">
                Отметить
              </Button>
            )
      }
    >
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />

      <Title level={5}>{"Имя"}</Title>
      <TextField value={record?.first_name} />

      <Title level={5}>{"Фамилия"}</Title>
      <TextField value={record?.last_name} />

      <Title level={5}>{"Номер группы"}</Title>
      <TextField value={record?.group_name} />

      <Title level={5}>{"Отмечен"}</Title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {isPresent ? (
          <>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span>Да</span>
          </>
        ) : (
          <>
            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
            <span>Нет</span>
          </>
        )}
      </div>

      <Title level={5}>{"Роль"}</Title>
      <TextField value={roleData?.data.name || "-"} />

      {qrCodeUrl && (
        <>
          <Title level={5}>QR-код</Title>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{ width: 150, height: 150 }}
          />
        </>
      )}
      <Title level={5} style={{ marginTop: "1.2em" }}>
        {"Значения активностей"}
      </Title>
      {activityVars?.length ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          {activityVars.map((activity: any, index: number) => {
            const activityName = activitiesData?.data?.find(
              (a) => a.id === activity.activity_id
            )?.name;

            return (
              <Card
                key={index}
                type="inner"
                title={`Активность: ${activityName ?? activity.activity_id}`}
              >
                <Space direction="vertical">
                  {activity.act_vars.map(
                    ([key, value]: [string, string], idx: number) => (
                      <Text key={idx}>
                        {key}: {value}
                      </Text>
                    )
                  )}
                </Space>
              </Card>
            );
          })}
        </Space>
      ) : (
        <Text type="secondary">Нет значений активностей</Text>
      )}
    </Show>
  );
};
