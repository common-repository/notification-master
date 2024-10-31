/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * External dependencies
 */
import { map, keys } from 'lodash';

/**
 * Internal dependencies
 */
import config from '@Config';
import type { Integration, IntegrationsList } from './types';
import './email';
import './webhook';
import './discord';
import './webpush';

export const registerIntegration = (integration, slug) => {
	window['NotificationMasterIntegrations'] =
		window['NotificationMasterIntegrations'] || {};
	window['NotificationMasterIntegrations'][slug] = applyFilters(
		'NotificationMaster.Integration',
		{
			name: integration.name,
			description: integration.description,
			icon: integration.icon || null,
			component: () => null,
			properties: integration.properties || {},
			available: config.isPro,
			configured: true,
		},
		slug
	) as Integration;
};

/**
 * Get integration by slug
 *
 * @param {string} slug
 *
 * @returns {Integration} integration
 */
export const getIntegration: (slug: string) => Integration = (slug) => {
	return window['NotificationMasterIntegrations'][slug];
};

/**
 * Get all registered integrations
 *
 * @returns {IntegrationsList} integrations
 */
export const getRegisteredIntegrations: () => IntegrationsList = () => {
	return window['NotificationMasterIntegrations'];
};

const integrationsConfig = config.integrations;

map(keys(integrationsConfig), (key) => {
	const integration = integrationsConfig[key];
	registerIntegration(integration, key);
});
