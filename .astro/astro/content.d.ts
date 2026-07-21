declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"10am-commute-childcare-tenure-requirement-abolished.md": {
	id: "10am-commute-childcare-tenure-requirement-abolished.md";
  slug: "10am-commute-childcare-tenure-requirement-abolished";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"child-allowance-2026-age-9-expansion.md": {
	id: "child-allowance-2026-age-9-expansion.md";
  slug: "child-allowance-2026-age-9-expansion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"energy-voucher-2026-701300-won.md": {
	id: "energy-voucher-2026-701300-won.md";
  slug: "energy-voucher-2026-701300-won";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"housing-benefit-2026-expanded-selection-criteria.md": {
	id: "housing-benefit-2026-expanded-selection-criteria.md";
  slug: "housing-benefit-2026-expanded-selection-criteria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"jeonse-fraud-victim-auction-profit-advance-payment.md": {
	id: "jeonse-fraud-victim-auction-profit-advance-payment.md";
  slug: "jeonse-fraud-victim-auction-profit-advance-payment";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"labor-shortage-job-companion-incentive-senior.md": {
	id: "labor-shortage-job-companion-incentive-senior.md";
  slug: "labor-shortage-job-companion-incentive-senior";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"multi-child-highway-toll-discount-2026.md": {
	id: "multi-child-highway-toll-discount-2026.md";
  slug: "multi-child-highway-toll-discount-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"national-employment-support-youth-special-case-60man.md": {
	id: "national-employment-support-youth-special-case-60man.md";
  slug: "national-employment-support-youth-special-case-60man";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"national-pension-2026-premium-rate-replacement-rate.md": {
	id: "national-pension-2026-premium-rate-replacement-rate.md";
  slug: "national-pension-2026-premium-rate-replacement-rate";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"national-pension-reduction-relief-2026-519-manwon.md": {
	id: "national-pension-reduction-relief-2026-519-manwon.md";
  slug: "national-pension-reduction-relief-2026-519-manwon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"national-tomorrow-learning-card-2026-changes.md": {
	id: "national-tomorrow-learning-card-2026-changes.md";
  slug: "national-tomorrow-learning-card-2026-changes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"newborn-special-supply-private-housing-2026.md": {
	id: "newborn-special-supply-private-housing-2026.md";
  slug: "newborn-special-supply-private-housing-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"parental-leave-benefit-2026-250-manwon-1-year-6-months.md": {
	id: "parental-leave-benefit-2026-250-manwon-1-year-6-months.md";
  slug: "parental-leave-benefit-2026-250-manwon-1-year-6-months";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"public-menstrual-pad-dispenser-pilot-2026.md": {
	id: "public-menstrual-pad-dispenser-pilot-2026.md";
  slug: "public-menstrual-pad-dispenser-pilot-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"seoul-standup-project-small-business-restart-2026.md": {
	id: "seoul-standup-project-small-business-restart-2026.md";
  slug: "seoul-standup-project-small-business-restart-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"short-term-parental-leave-2026.md": {
	id: "short-term-parental-leave-2026.md";
  slug: "short-term-parental-leave-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sickness-benefit-pilot-program-2026.md": {
	id: "sickness-benefit-pilot-program-2026.md";
  slug: "sickness-benefit-pilot-program-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"small-business-refinance-loan-2026-4-5-percent.md": {
	id: "small-business-refinance-loan-2026-4-5-percent.md";
  slug: "small-business-refinance-loan-2026-4-5-percent";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"small-business-stability-voucher-2026-250000-won.md": {
	id: "small-business-stability-voucher-2026-250000-won.md";
  slug: "small-business-stability-voucher-2026-250000-won";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"unemployment-benefit-2026-upper-limit-raised.md": {
	id: "unemployment-benefit-2026-upper-limit-raised.md";
  slug: "unemployment-benefit-2026-upper-limit-raised";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"yellow-umbrella-mutual-aid-annual-limit-increase.md": {
	id: "yellow-umbrella-mutual-aid-annual-limit-increase.md";
  slug: "yellow-umbrella-mutual-aid-annual-limit-increase";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"youth-future-savings-account-2nd-round-december.md": {
	id: "youth-future-savings-account-2nd-round-december.md";
  slug: "youth-future-savings-account-2nd-round-december";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"youth-job-leap-subsidy-non-capital-region-2026.md": {
	id: "youth-job-leap-subsidy-non-capital-region-2026.md";
  slug: "youth-job-leap-subsidy-non-capital-region-2026";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
