import { type EnhanceElemFn } from "@enhance/types";
import { type Location } from "@remix-run/router";

import { type SerializeFrom } from "./responses";

export function useActionData<Data = unknown>(
	fn: EnhanceElemFn,
	state: { store: Record<any, any> }
): SerializeFrom<Data>;

export function useElementName(fn: EnhanceElemFn): string;

export function useRouteError(
	fn: EnhanceElemFn,
	state: { store: Record<any, any> }
): unknown;

export function useLocation(state: { store: Record<any, any> }): Location;

export function useLoaderData<Data = unknown>(
	fn: EnhanceElemFn,
	state: { store: Record<any, any> }
): SerializeFrom<Data>;
