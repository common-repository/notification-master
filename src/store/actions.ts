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
import {
	Settings,
	SetSettingsAction,
	UpdateSettingAction,
	Notice,
	AddNoticeAction,
	DeleteNoticeAction,
	SetTotalNotifications,
	ToggleProAlertAction,
	ToggleMergeTagsAction,
} from './types';

/**
 * Set general settings action.
 *
 * @param {Settings} settings General settings.
 *
 * @return {SetSettingsAction} Action.
 */
export const setSettings = (settings: Settings): SetSettingsAction => ({
	type: SET_SETTINGS,
	settings: settings,
});

/**
 * Update general setting action.
 *
 * @param {string} key   Setting key.
 * @param {any}    value Setting value.
 *
 * @return {UpdateSettingAction} Action.
 */
export const updateSetting = (
	key: string,
	value: any
): UpdateSettingAction => ({
	type: UPDATE_SETTING,
	key,
	value,
});

/**
 * Add notice action.
 *
 * @param {Notice} notice Notice.
 *
 * @return {AddNoticeAction} Action.
 */
export const addNotice = (notice: Notice): AddNoticeAction => ({
	type: ADD_NOTICE,
	notice,
});

/**
 * Delete notice action.
 *
 * @param {string} id Notice ID.
 *
 * @return {DeleteNoticeAction} Action.
 */
export const deleteNotice = (id: string): DeleteNoticeAction => ({
	type: DELETE_NOTICE,
	id,
});

/**
 * Set total notifications action.
 *
 * @param {number} total Total notifications.
 *
 * @return {SetTotalNotifications} Action.
 */
export const setTotalNotifications = (
	total: number
): SetTotalNotifications => ({
	type: SET_TOTAL_NOTIFICATIONS,
	total,
});

/**
 * Toggle pro alert action.
 *
 * @param {boolean} status Pro alert status.
 *
 * @return {ToggleProAlertAction} Action.
 */
export const toggleProAlert = (status: boolean): ToggleProAlertAction => ({
	type: TOGGLE_PRO_ALERT,
	status,
});

/**
 * Toggle merge tags action.
 *
 * @param {boolean} status Merge tags status.
 *
 * @return {ToggleMergeTagsAction} Action.
 */
export const toggleMergeTags = (status: boolean): ToggleMergeTagsAction => ({
	type: TOGGLE_MERGE_TAGS,
	status,
});
