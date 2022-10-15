import {
	type ActionFunctionArgs,
	type AgnosticDataRouteObject,
	type LoaderFunctionArgs,
	type Location,
	type Params,
} from "@remix-run/router";

export type LoaderFunction = (
	args: LoaderFunctionArgs
) => Promise<TypedResponse>;

export type ActionFunction = (
	args: ActionFunctionArgs
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
