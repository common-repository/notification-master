/**
 * External dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import config from '@Config';

export const getSettings =
	() =>
	async ({ dispatch }) => {
		const settings = await apiFetch({
			path: addQueryArgs('/ntfm/v1/settings'),
		});
		dispatch.setSettings(settings);
	};

export const getIntegration =
	(slug) =>
	async ({ dispatch }) => {
		const integration = await apiFetch({
			path: addQueryArgs(`/ntfm/v1/integrations/${slug}`),
		});
		dispatch.receiveIntegration(slug, integration);
	};

export const getTotalNotifications =
	() =>
	async ({ dispatch }) => {
		// @ts-ignore
		const total = parseInt(config.totalNotifications) || 0;
		dispatch.setTotalNotifications(total);
	};
