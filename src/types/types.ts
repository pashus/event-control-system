type TActVarPair = [string, string];

interface IActivity {
  name: string;
  act_vars: TActVarPair[];
}

interface IRoleActivityValue {
  act_vars: TActVarPair[];
}

interface IRoles {
  name: string;
  activities_values: IRoleActivityValue[];
}

export interface ICreateEventValues {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  has_player_balance: true | false;
  activities: IActivity[];
  roles: IRoles[];
  reg_form: object;
}
