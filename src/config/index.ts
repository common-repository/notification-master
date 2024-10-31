/**
 * Internal dependencies.
 */
import { Config } from './types';

// Export types.
export * from './types';

const defaultConfig: Config = {
	adminUrl: '',
	ajaxUrl: '',
	assetsUrl: '',
	nonce: '',
	parentPageSlug: '',
	postTypes: [],
	taxonomies: [],
	commentTypes: [],
	totalNotifications: 0,
	triggersGroups: {},
	integrations: {},
	ntfmSiteUrl: '',
	isPro: false,
	userRoles: {},
	subscriptionCount: 0,
};
const config: Config =
	(window as any)['NotificationsMasterConfig'] || defaultConfig;

export default config;
