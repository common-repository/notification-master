/**
 * External dependencies
 */
import type { FunctionKeys } from 'utility-types';

/**
 * Internal dependencies.
 */
import {
	SET_SETTINGS,
	UPDATE_SETTING,
	ADD_NOTICE,
	DELETE_NOTICE,
	SET_TOTAL_NOTIFICATIONS,
	TOGGLE_PRO_ALERT,
	TOGGLE_MERGE_TAGS,
} from './constants';

export type InitialState = {
	settings: Settings;
	notices: Notices;
	totalNotifications: number;
	proAlert: boolean;
	mergeTags: boolean;
};

export type SetTotalNotifications = {
	type: typeof SET_TOTAL_NOTIFICATIONS;
	total: number;
};

export type Notices = {
	[id: string]: Notice;
};

export type Settings = {
	[key: string]: any;
	normal_button_text: string;
	normal_button_color: string;
	normal_button_background_color: string;
	normal_button_hover_color: string;
	normal_button_hover_background_color: string;
	normal_button_padding: string;
	normal_button_margin: string;
	normal_button_border_radius: string;
	normal_button_unsubscribe_text: string;
	enable_floating_button: boolean;
	floating_button_tooltip_subscribe_text: string;
	floating_button_tooltip_unsubscribe_text: string;
	floating_button_color: string;
	floating_button_background_color: string;
	floating_button_hover_color: string;
	floating_button_hover_background_color: string;
	floating_button_width: string;
	floating_button_height: string;
	floating_button_border_radius: string;
	enable_floating_button_animation: boolean;
	normal_button_extra_class: string;
	floating_button_extra_class: string;
	normal_button_id: string;
	floating_button_id: string;
	enable_floating_button_tooltip: boolean;
	floating_button_position: string;
	floating_button_top: string;
	floating_button_right: string;
	floating_button_bottom: string;
	floating_button_left: string;
	floating_button_z_index: string;
};

export type SetSettingsAction = {
	type: typeof SET_SETTINGS;
	settings: Settings;
};

export type UpdateSettingAction = {
	type: typeof UPDATE_SETTING;
	key: string;
	value: any;
};

export type AddNoticeAction = {
	type: typeof ADD_NOTICE;
	notice: Notice;
};

export type DeleteNoticeAction = {
	type: typeof DELETE_NOTICE;
	id: string;
};

export type ToggleProAlertAction = {
	type: typeof TOGGLE_PRO_ALERT;
	status: boolean;
};

export type ToggleMergeTagsAction = {
	type: typeof TOGGLE_MERGE_TAGS;
	status: boolean;
};

export type Notice = {
	message: string;
	description?: string;
	duration?: number;
	type: 'success' | 'info' | 'warning' | 'error';
};

export type Action =
	| SetSettingsAction
	| UpdateSettingAction
	| AddNoticeAction
	| DeleteNoticeAction
	| ToggleProAlertAction
	| ToggleMergeTagsAction
	| SetTotalNotifications;

/**
 * Maps a "raw" selector object to the selectors available when registered on the @wordpress/data store.
 *
 * @template S Selector map, usually from `import * as selectors from './my-store/selectors';`
 */

export type SelectFromMap<S extends Record<string, unknown>> = {
	[selector in FunctionKeys<S>]: S[selector] extends (...args: any[]) => any
	? (...args: TailParameters<S[selector]>) => ReturnType<S[selector]>
	: never;
};

/**
 * Maps a "raw" actionCreators object to the actions available when registered on the @wordpress/data store.
 *
 * @template A Selector map, usually from `import * as actions from './my-store/actions';`
 */
export type DispatchFromMap<A extends Record<string, (...args: any[]) => any>> =
	{
		[actionCreator in keyof A]: (
			...args: Parameters<A[actionCreator]>
		) => A[actionCreator] extends (...args: any[]) => Generator
			? Promise<GeneratorReturnType<A[actionCreator]>>
			: void;
	};
/**
 * Parameters type of a function, excluding the first parameter.
 *
 * This is useful for typing some @wordpres/data functions that make a leading
 * `state` argument implicit.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type TailParameters<F extends Function> = F extends (
	head: any,
	...tail: infer T
) => any
	? T
	: never;

/**
 * Obtain the type finally returned by the generator when it's done iterating.
 */
export type GeneratorReturnType<T extends (...args: any[]) => Generator> =
	T extends (...args: any) => Generator<any, infer R, any> ? R : never;

/**
 * Type helper that maps select() return types to their resolveSelect() return types.
 * This works by mapping over each Selector, and returning a function that
 * returns a Promise of the Selector's return type.
 */
export type PromiseifySelectors<Selectors> = {
	[SelectorFunction in keyof Selectors]: Selectors[SelectorFunction] extends (
		...args: infer SelectorArgs
	) => infer SelectorReturnType
	? (...args: SelectorArgs) => Promise<SelectorReturnType>
	: never;
};

// Type for the basic selectors built into @wordpress/data, note these
// types define the interface for the public selectors, so state is not an
// argument.
// [wp.data.getSelectors](https://github.com/WordPress/gutenberg/blob/319deee5f4d4838d6bc280e9e2be89c7f43f2509/packages/data/src/store/index.js#L16-L20)
// [selector.js](https://github.com/WordPress/gutenberg/blob/trunk/packages/data/src/redux-store/metadata/selectors.js#L48-L52)
export type WPDataSelectors = {
	getIsResolving: (selector: string, args?: unknown[]) => boolean;
	hasStartedResolution: (selector: string, args?: unknown[]) => boolean;
	hasFinishedResolution: (selector: string, args?: unknown[]) => boolean;
	isResolving: (selector: string, args?: unknown[]) => boolean;
	getCachedResolvers: () => unknown;
};

// [wp.data.getActions](https://github.com/WordPress/gutenberg/blob/319deee5f4d4838d6bc280e9e2be89c7f43f2509/packages/data/src/store/index.js#L31-L35)
// [actions.js](https://github.com/WordPress/gutenberg/blob/aa2bed9010aa50467cb43063e370b70a91591e9b/packages/data/src/redux-store/metadata/actions.js)
export type WPDataActions = {
	startResolution: (selector: string, args?: unknown[]) => void;
	finishResolution: (selector: string, args?: unknown[]) => void;
	invalidateResolution: (selector: string) => void;
	invalidateResolutionForStore: (selector: string) => void;
	invalidateResolutionForStoreSelector: (selector: string) => void;
};

// Omitting state from selector parameter
export type WPDataSelector<T> = T extends (
	// @ts-ignore
	state: infer S,
	...args: infer A
) => infer R
	? (...args: A) => R
	: T;

export type WPError<ErrorKey extends string = string, ErrorData = unknown> = {
	errors: Record<ErrorKey, string[]>;
	error_data?: Record<ErrorKey, ErrorData>;
	additional_data?: Record<ErrorKey, ErrorData[]>;
};
