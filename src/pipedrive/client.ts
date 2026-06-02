import { AppConfig } from "../config.js";
import { compactObject } from "../utils/json.js";
import { PipedriveApiError } from "./errors.js";
import {
  AddNoteInput,
  CreateActivityInput,
  ListActivitiesParams,
  ListNotesParams,
  PipedriveResponse,
  SearchParams,
  UpdateDealInput,
  UpdatePersonInput
} from "./types.js";

type HttpMethod = "GET" | "POST" | "PUT";

export class PipedriveClient {
  constructor(private readonly config: AppConfig) {}

  searchDeals(params: SearchParams) {
    return this.get("deals/search", params);
  }

  getDeal(id: number) {
    return this.get(`deals/${id}`);
  }

  updateDeal(id: number, input: UpdateDealInput) {
    return this.put(`deals/${id}`, this.flattenCustomFields(input));
  }

  searchPersons(params: SearchParams) {
    return this.get("persons/search", params);
  }

  getPerson(id: number) {
    return this.get(`persons/${id}`);
  }

  updatePerson(id: number, input: UpdatePersonInput) {
    return this.put(`persons/${id}`, this.flattenCustomFields(input));
  }

  searchOrganizations(params: SearchParams) {
    return this.get("organizations/search", params);
  }

  getOrganization(id: number) {
    return this.get(`organizations/${id}`);
  }

  listActivities(params: ListActivitiesParams) {
    return this.get("activities", params);
  }

  createActivity(input: CreateActivityInput) {
    return this.post("activities", input);
  }

  listNotes(params: ListNotesParams) {
    return this.get("notes", params);
  }

  addNote(input: AddNoteInput) {
    return this.post("notes", input);
  }

  listPipelines() {
    return this.get("pipelines");
  }

  listStages() {
    return this.get("stages");
  }

  listUsers() {
    return this.get("users");
  }

  listDealFields() {
    return this.get("dealFields");
  }

  listPersonFields() {
    return this.get("personFields");
  }

  listOrganizationFields() {
    return this.get("organizationFields");
  }

  private get(path: string, params: object = {}) {
    return this.request("GET", path, undefined, params);
  }

  private post(path: string, body: object) {
    return this.request("POST", path, body);
  }

  private put(path: string, body: object) {
    return this.request("PUT", path, body);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: object,
    params: object = {}
  ): Promise<PipedriveResponse<T>> {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(compactObject(body)) : undefined
      });

      const payload = (await response.json().catch(() => undefined)) as PipedriveResponse<T> | undefined;

      if (!response.ok || payload?.success === false) {
        throw new PipedriveApiError(
          payload?.error ?? `Pipedrive API request failed with status ${response.status}.`,
          response.status,
          payload
        );
      }

      return payload ?? ({ success: true } as PipedriveResponse<T>);
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildUrl(path: string, params: object): string {
    const url = new URL(`${this.config.apiBaseUrl.replace(/\/$/, "")}/${path}`);
    url.searchParams.set("api_token", this.config.apiToken);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }

  private flattenCustomFields<T extends { custom_fields?: Record<string, unknown> }>(input: T) {
    const { custom_fields, ...rest } = input;
    return {
      ...rest,
      ...(custom_fields ?? {})
    };
  }
}
