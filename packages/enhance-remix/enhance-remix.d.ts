import { type EnhanceElemFn } from "@enhance/types";
import {
	type AgnosticDataRouteObject,
	type LoaderFunctionArgs,
	type Location,
	type Params,
} from "@remix-run/router";

export {
	ErrorResponse,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from "@remix-run/router";

export type LoaderFunction = (
	args: LoaderFunctionArgs
) => Promise<TypedResponse>;

type AppData = any;
export interface RouteData {
	[routeId: string]: AppData;
}

export type MetaFunctionArgs<
	Loader extends LoaderFunction | unknown = unknown,
	ParentsLoaders extends Record<string, LoaderFunction> = {}
> = {
	data: Loader extends LoaderFunction ? SerializeFrom<Loader> : AppData;
	parentsData: {
		[k in keyof ParentsLoaders]: SerializeFrom<ParentsLoaders[k]>;
	} & RouteData;
	params: Params;
	location: Location;
};

export interface MetaFunction<
	Loader extends LoaderFunction | unknown = unknown,
	ParentsLoaders extends Record<string, LoaderFunction> = {}
> {
	(args: MetaFunctionArgs<Loader, ParentsLoaders>): HtmlMetaDescriptor;
}

export interface LinksFunction {
	(): LinkDescriptor[];
}

export interface HtmlMetaDescriptor {
	charset?: "utf-8";
	charSet?: "utf-8";
	title?: string;
	lang?: string;
	[name: string]:
		| null
		| string
		| undefined
		| Record<string, string>
		| Array<Record<string, string> | string>;
}

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type LiteralUnion<LiteralType, BaseType extends Primitive> =
	| LiteralType
	| (BaseType & Record<never, never>);

interface HtmlLinkProps {
	/**
	 * Address of the hyperlink
	 */
	href?: string;

	/**
	 * How the element handles crossorigin requests
	 */
	crossOrigin?: "anonymous" | "use-credentials";

	/**
	 * Relationship between the document containing the hyperlink and the destination resource
	 */
	rel: LiteralUnion<
		| "alternate"
		| "dns-prefetch"
		| "icon"
		| "manifest"
		| "modulepreload"
		| "next"
		| "pingback"
		| "preconnect"
		| "prefetch"
		| "preload"
		| "prerender"
		| "search"
		| "stylesheet",
		string
	>;

	/**
	 * Applicable media: "screen", "print", "(max-width: 764px)"
	 */
	media?: string;

	/**
	 * Integrity metadata used in Subresource Integrity checks
	 */
	integrity?: string;

	/**
	 * Language of the linked resource
	 */
	hrefLang?: string;

	/**
	 * Hint for the type of the referenced resource
	 */
	type?: string;

	/**
	 * Referrer policy for fetches initiated by the element
	 */
	referrerPolicy?:
		| ""
		| "no-referrer"
		| "no-referrer-when-downgrade"
		| "same-origin"
		| "origin"
		| "strict-origin"
		| "origin-when-cross-origin"
		| "strict-origin-when-cross-origin"
		| "unsafe-url";

	/**
	 * Sizes of the icons (for rel="icon")
	 */
	sizes?: string;

	/**
	 * Potential destination for a preload request (for rel="preload" and rel="modulepreload")
	 */
	as?: LiteralUnion<
		| "audio"
		| "audioworklet"
		| "document"
		| "embed"
		| "fetch"
		| "font"
		| "frame"
		| "iframe"
		| "image"
		| "manifest"
		| "object"
		| "paintworklet"
		| "report"
		| "script"
		| "serviceworker"
		| "sharedworker"
		| "style"
		| "track"
		| "video"
		| "worker"
		| "xslt",
		string
	>;

	/**
	 * Color to use when customizing a site's icon (for rel="mask-icon")
	 */
	color?: string;

	/**
	 * Whether the link is disabled
	 */
	disabled?: boolean;

	/**
	 * The title attribute has special semantics on this element: Title of the link; CSS style sheet set name.
	 */
	title?: string;

	/**
	 * Images to use in different situations, e.g., high-resolution displays,
	 * small monitors, etc. (for rel="preload")
	 */
	imageSrcSet?: string;

	/**
	 * Image sizes for different page layouts (for rel="preload")
	 */
	imageSizes?: string;
}

interface HtmlLinkPreloadImage extends HtmlLinkProps {
	/**
	 * Relationship between the document containing the hyperlink and the destination resource
	 */
	rel: "preload";

	/**
	 * Potential destination for a preload request (for rel="preload" and rel="modulepreload")
	 */
	as: "image";

	/**
	 * Address of the hyperlink
	 */
	href?: string;

	/**
	 * Images to use in different situations, e.g., high-resolution displays,
	 * small monitors, etc. (for rel="preload")
	 */
	imageSrcSet: string;

	/**
	 * Image sizes for different page layouts (for rel="preload")
	 */
	imageSizes?: string;
}

/**
 * Represents a `<link>` element.
 *
 * WHATWG Specification: https://html.spec.whatwg.org/multipage/semantics.html#the-link-element
 */
export type HtmlLinkDescriptor =
	// Must have an href *unless* it's a `<link rel="preload" as="image">` with an
	// `imageSrcSet` and `imageSizes` props
	(
		| (HtmlLinkProps & Pick<Required<HtmlLinkProps>, "href">)
		| (HtmlLinkPreloadImage &
				Pick<Required<HtmlLinkPreloadImage>, "imageSizes">)
		| (HtmlLinkPreloadImage &
				Pick<Required<HtmlLinkPreloadImage>, "href"> & { imageSizes?: never })
	) & {
		/**
		 * @deprecated Use `imageSrcSet` instead.
		 */
		imagesrcset?: string;

		/**
		 * @deprecated Use `imageSizes` instead.
		 */
		imagesizes?: string;
	};

export interface PageLinkDescriptor
	extends Omit<
		HtmlLinkDescriptor,
		| "href"
		| "rel"
		| "type"
		| "sizes"
		| "imageSrcSet"
		| "imageSizes"
		| "imagesrcset"
		| "imagesizes"
		| "as"
		| "color"
		| "title"
	> {
	/**
	 * The absolute path of the page to prefetch.
	 */
	page: string;
}

export type LinkDescriptor = HtmlLinkDescriptor | PageLinkDescriptor;

export type RequestHandler = (request: Request) => Promise<Response>;

export function createRequestHandler(
	routes: AgnosticDataRouteObject[],
	elements: unknown
): RequestHandler;

export function json<Data extends unknown>(
	data: Data,
	init?: number | ResponseInit
): TypedResponse<Data>;

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

// must be a type since this is a subtype of response
// interfaces must conform to the types they extend
export type TypedResponse<T extends unknown = unknown> = Response & {
	json(): Promise<T>;
};

type JsonPrimitive =
	| string
	| number
	| boolean
	| String
	| Number
	| Boolean
	| null;
type NonJsonPrimitive = undefined | Function | symbol;

/*
 * `any` is the only type that can let you equate `0` with `1`
 * See https://stackoverflow.com/a/49928360/1490091
 */
type IsAny<T> = 0 extends 1 & T ? true : false;

// prettier-ignore
type Serialize<T> =
  IsAny<T> extends true ? any :
  T extends JsonPrimitive ? T :
  T extends NonJsonPrimitive ? never :
  T extends { toJSON(): infer U } ? U :
  T extends [] ? [] :
  T extends [unknown, ...unknown[]] ? SerializeTuple<T> :
  T extends ReadonlyArray<infer U> ? (U extends NonJsonPrimitive ? null : Serialize<U>)[] :
  T extends object ? SerializeObject<UndefinedToOptional<T>> :
  never;

/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
type SerializeTuple<T extends [unknown, ...unknown[]]> = {
	[k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>;
};

/** JSON serialize objects (not including arrays) and classes */
type SerializeObject<T extends object> = {
	[k in keyof T as T[k] extends NonJsonPrimitive ? never : k]: Serialize<T[k]>;
};

/*
 * For an object T, if it has any properties that are a union with `undefined`,
 * make those into optional properties instead.
 *
 * Example: { a: string | undefined} --> { a?: string}
 */
type UndefinedToOptional<T extends object> = {
	// Property is not a union with `undefined`, keep as-is
	[k in keyof T as undefined extends T[k] ? never : k]: T[k];
} & {
	// Property _is_ a union with `defined`. Set as optional (via `?`) and remove `undefined` from the union
	[k in keyof T as undefined extends T[k] ? k : never]?: Exclude<
		T[k],
		undefined
	>;
};

type ArbitraryFunction = (...args: any[]) => unknown;

/**
 * Infer JSON serialized data type returned by a loader or action.
 *
 * For example:
 * `type LoaderData = SerializeFrom<typeof loader>`
 */
export type SerializeFrom<T extends any | ArbitraryFunction> = T extends (
	...args: any[]
) => infer Output
	? Awaited<Output> extends TypedResponse<infer U>
		? Serialize<U>
		: Awaited<Output>
	: Awaited<T>;
