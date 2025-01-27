/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appointment from "../appointment.js";
import type * as bills from "../bills.js";
import type * as contacts from "../contacts.js";
import type * as crons from "../crons.js";
import type * as getdoctorslots from "../getdoctorslots.js";
import type * as hospitals from "../hospitals.js";
import type * as http from "../http.js";
import type * as index from "../index.js";
import type * as investigations from "../investigations.js";
import type * as iot from "../iot.js";
import type * as labReports from "../labReports.js";
import type * as lib_mockapi from "../lib/mockapi.js";
import type * as lib_mockconvex from "../lib/mockconvex.js";
import type * as lib_quickcache from "../lib/quickcache.js";
import type * as lib_utils from "../lib/utils.js";
import type * as machines from "../machines.js";
import type * as medicalCamps from "../medicalCamps.js";
import type * as messages from "../messages.js";
import type * as patients from "../patients.js";
import type * as patientsearch from "../patientsearch.js";
import type * as prescriptions from "../prescriptions.js";
import type * as quickmedi from "../quickmedi.js";
import type * as scheduledCalls from "../scheduledCalls.js";
import type * as service_openai from "../service/openai.js";
import type * as slots from "../slots.js";
import type * as users from "../users.js";
import type * as vaccinations from "../vaccinations.js";
import type * as vendors from "../vendors.js";
import type * as videos from "../videos.js";
import type * as watiWebhook from "../watiWebhook.js";
import type * as watsappapi from "../watsappapi.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
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
  bills: typeof bills;
  contacts: typeof contacts;
  crons: typeof crons;
  getdoctorslots: typeof getdoctorslots;
  hospitals: typeof hospitals;
  http: typeof http;
  index: typeof index;
  investigations: typeof investigations;
  iot: typeof iot;
  labReports: typeof labReports;
  "lib/mockapi": typeof lib_mockapi;
  "lib/mockconvex": typeof lib_mockconvex;
  "lib/quickcache": typeof lib_quickcache;
  "lib/utils": typeof lib_utils;
  machines: typeof machines;
  medicalCamps: typeof medicalCamps;
  messages: typeof messages;
  patients: typeof patients;
  patientsearch: typeof patientsearch;
  prescriptions: typeof prescriptions;
  quickmedi: typeof quickmedi;
  scheduledCalls: typeof scheduledCalls;
  "service/openai": typeof service_openai;
  slots: typeof slots;
  users: typeof users;
  vaccinations: typeof vaccinations;
  vendors: typeof vendors;
  videos: typeof videos;
  watiWebhook: typeof watiWebhook;
  watsappapi: typeof watsappapi;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  geospatial: {
    document: {
      get: FunctionReference<
        "query",
        "internal",
        { key: string },
        {
          coordinates: { latitude: number; longitude: number };
          filterKeys: Record<
            string,
            | string
            | number
            | boolean
            | null
            | bigint
            | Array<string | number | boolean | null | bigint>
          >;
          key: string;
          sortKey: number;
        } | null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        {
          document: {
            coordinates: { latitude: number; longitude: number };
            filterKeys: Record<
              string,
              | string
              | number
              | boolean
              | null
              | bigint
              | Array<string | number | boolean | null | bigint>
            >;
            key: string;
            sortKey: number;
          };
          levelMod: number;
          maxCells: number;
          maxLevel: number;
          minLevel: number;
        },
        null
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        {
          key: string;
          levelMod: number;
          maxCells: number;
          maxLevel: number;
          minLevel: number;
        },
        boolean
      >;
    };
    query: {
      debugCells: FunctionReference<
        "query",
        "internal",
        {
          levelMod: number;
          maxCells: number;
          maxLevel: number;
          minLevel: number;
          rectangle: {
            east: number;
            north: number;
            south: number;
            west: number;
          };
        },
        Array<{
          token: string;
          vertices: Array<{ latitude: number; longitude: number }>;
        }>
      >;
      execute: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          levelMod: number;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          maxCells: number;
          maxLevel: number;
          minLevel: number;
          query: {
            filtering: Array<{
              filterKey: string;
              filterValue: string | number | boolean | null | bigint;
              occur: "should" | "must";
            }>;
            maxResults: number;
            rectangle: {
              east: number;
              north: number;
              south: number;
              west: number;
            };
            sorting: {
              interval: { endExclusive?: number; startInclusive?: number };
            };
          };
        },
        {
          nextCursor?: string;
          results: Array<{
            coordinates: { latitude: number; longitude: number };
            key: string;
          }>;
        }
      >;
      nearestPoints: FunctionReference<
        "query",
        "internal",
        {
          levelMod: number;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          maxDistance?: number;
          maxLevel: number;
          maxResults: number;
          minLevel: number;
          nextCursor?: string;
          point: { latitude: number; longitude: number };
        },
        Array<{
          coordinates: { latitude: number; longitude: number };
          distance: number;
          key: string;
        }>
      >;
    };
  };
};
