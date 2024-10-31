/**
 * External dependencies
 */
import type { Reducer } from 'redux';

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
import type { Action, InitialState } from './types';

// Initial state.
const initialState: InitialState = {
	settings: {},
	notices: {},
	totalNotifications: 0,
	proAlert: false,
	mergeTags: false,
};

const randomId = () => Math.random().toString(36).substr(2, 9);

/**
 * Reducer.
 *
 * @param {InitialState} state  State.
 * @param {Action} action Action.
 *
 * @return {InitialState} State.
 */
const reducer: Reducer<InitialState, Action> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case SET_SETTINGS:
			return {
				...state,
				settings: action.settings,
			};
		case UPDATE_SETTING:
			return {
				...state,
				settings: {
					...state.settings,
					[action.key]: action.value,
				},
			};
		case ADD_NOTICE:
			const noteId = randomId();
			const notice = {
				...action.notice,
				noteId,
			};

			return {
				...state,
				notices: {
					...state.notices,
					[noteId]: notice,
				},
			};
		case DELETE_NOTICE:
			const newNotices = { ...state.notices };
			if (newNotices[action.id]) {
				delete newNotices[action.id];
			}
			return {
				...state,
				notices: newNotices,
			};
		case SET_TOTAL_NOTIFICATIONS:
			return {
				...state,
				totalNotifications: action.total,
			};
		case TOGGLE_PRO_ALERT:
			return {
				...state,
				proAlert: action.status,
			};
		case TOGGLE_MERGE_TAGS:
			return {
				...state,
				mergeTags: !state.mergeTags,
			};
		default:
			return state;
	}
};

export type State = ReturnType<typeof reducer>;
export default reducer;
