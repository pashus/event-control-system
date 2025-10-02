export type TActVarPair = [string, string];

export interface IActivity {
  id: string;
  name: string;
  act_vars: TActVarPair[];
}

export interface IRoleActivityValue {
  act_vars: TActVarPair[];
}

export interface IRoles {
  name: string;
  activities_values: IRoleActivityValue[];
}

export interface ICreateEventValues {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  has_player_balance: boolean;
  activities: IActivity[];
  roles: IRoles[];
  reg_form: object;
}
