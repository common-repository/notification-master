/**
 * Internal Dependencies
 */
import { State } from './reducer';
import { Settings, Notice, Notices } from './types';

/**
 * Get general settings.
 *
 * @param {State} state State.
 *
 * @return {Settings} General settings.
 */
export const getSettings = (state: State): Settings => state.settings;

/**
 * Get notices.
 *
 * @param {State} state State.
 *
 * @return {Notices} Notices.
 */
export const getNotices = (state: State): Notices => state.notices;

/**
 * Get notice by ID.
 *
 * @param {State}  state State.
 * @param {string} id    Notice ID.
 *
 * @return {Notice | undefined} Notice.
 */
export const getNoticeById = (state: State, id: string): Notice | undefined =>
	state.notices[id];

/**
 * Get total notifications.
 *
 * @param {State} state State.
 *
 * @return {number} Total notifications.
 */
export const getTotalNotifications = (state: State): number =>
	state.totalNotifications;

/**
 * Get pro alert status.
 *
 * @param {State} state State.
 *
 * @return {boolean} Pro alert status.
 */
export const getProAlert = (state: State): boolean => state.proAlert;

/**
 * Get merge tags status.
 *
 * @param {State} state State.
 *
 * @return {boolean} Merge tags status.
 */
export const getMergeTags = (state: State): boolean => state.mergeTags;
