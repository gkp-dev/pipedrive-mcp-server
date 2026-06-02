export type QueryValue = string | number | boolean | undefined | null;

export interface PipedriveResponse<T> {
  success: boolean;
  data?: T;
  additional_data?: unknown;
  error?: string;
  error_info?: string;
}

export interface SearchParams {
  term: string;
  limit?: number;
  start?: number;
  fields?: string;
  exact_match?: boolean;
  status?: string;
  organization_id?: number;
  person_id?: number;
}

export interface ListActivitiesParams {
  deal_id?: number;
  person_id?: number;
  org_id?: number;
  user_id?: number;
  done?: boolean;
  type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  start?: number;
}

export interface ListNotesParams {
  deal_id?: number;
  person_id?: number;
  org_id?: number;
  lead_id?: string;
  limit?: number;
  start?: number;
}

export interface AddNoteInput {
  content: string;
  deal_id?: number;
  person_id?: number;
  org_id?: number;
  lead_id?: string;
  pinned_to_deal_flag?: boolean;
  pinned_to_person_flag?: boolean;
  pinned_to_organization_flag?: boolean;
}

export interface CreateActivityInput {
  subject: string;
  type?: string;
  due_date?: string;
  due_time?: string;
  duration?: string;
  done?: boolean;
  deal_id?: number;
  person_id?: number;
  org_id?: number;
  user_id?: number;
  note?: string;
}

export interface UpdateDealInput {
  title?: string;
  value?: number;
  currency?: string;
  status?: "open" | "won" | "lost";
  stage_id?: number;
  user_id?: number;
  person_id?: number;
  org_id?: number;
  expected_close_date?: string;
  custom_fields?: Record<string, string | number | boolean | null>;
}

export interface UpdatePersonInput {
  name?: string;
  owner_id?: number;
  org_id?: number;
  email?: string | Array<{ value: string; primary?: boolean; label?: string }>;
  phone?: string | Array<{ value: string; primary?: boolean; label?: string }>;
  custom_fields?: Record<string, string | number | boolean | null>;
}
