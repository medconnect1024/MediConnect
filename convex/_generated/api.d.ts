/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as appointment from "../appointment.js";
import type * as contacts from "../contacts.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as labReports from "../labReports.js";
import type * as messages from "../messages.js";
import type * as patients from "../patients.js";
import type * as patientsearch from "../patientsearch.js";
import type * as prescriptions from "../prescriptions.js";
import type * as scheduledCalls from "../scheduledCalls.js";
import type * as users from "../users.js";
import type * as watiWebhook from "../watiWebhook.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  appointment: typeof appointment;
  contacts: typeof contacts;
  crons: typeof crons;
  http: typeof http;
  labReports: typeof labReports;
  messages: typeof messages;
  patients: typeof patients;
  patientsearch: typeof patientsearch;
  prescriptions: typeof prescriptions;
  scheduledCalls: typeof scheduledCalls;
  users: typeof users;
  watiWebhook: typeof watiWebhook;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
