/**
 * External dependencies
 */
import { isEmpty, keys } from 'lodash';

/**
 * Internal dependencies
 */
import Config from '@Config';
import { getIntegration } from '@Integrations';

/**
 * Get the base name of the current URL.
 *
 * @return {string} The base name of the current URL.
 */
export const getBaseName = () => {
	const path = document.location.pathname;
	const basename = path.substring(0, path.lastIndexOf('/'));

	return basename;
};

/**
 * Get the path to the admin page.
 *
 * @param {string|null} slug The slug of the current page.
 * @param {number|null} id The ID of the current page.
 *
 * @return {string} The path to the admin page.
 */
export const getPath = (
	slug: string | null = null,
	id: number | string | null = null,
	tab: string | null = null
) => {
	const basename = getBaseName();
	let path = `${basename}/admin.php`;

	if (slug) {
		path += `?page=ntfm-${slug}`;
	}

	if (id) {
		path += `&id=${id}`;
	}

	if (tab) {
		path += `&tab=${tab}`;
	}

	return path;
};

/**
 * Generate random string id.
 *
 * @param {number} length The length of the random string.
 *
 * @return {string} The random string.
 */
export const generateId = (length: number = 8) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const charactersLength = characters.length;
	let result = '';

	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}

	return result;
};

/**
 * Check integration properties for required fields.
 *
 * @param {string} integration The integration slug.
 * @param {Object} values The values to check.
 *
 * @return {boolean} The result of the check.
 */
export const checkRequiredFields = (integration: string, values: any) => {
	const integrationData = getIntegration(integration);
	const properties = integrationData.properties;

	const check = checkPropertiesRecursively(properties, values);

	return check;
};

/**
 * Check properties recursively.
 *
 * @param {Object} properties The properties to check.
 * @param {Object} values The values to check.
 *
 * @return {boolean} The result of the check.
 */
const checkPropertiesRecursively = (properties: any, values: any) => {
	let check = true;

	for (const key in properties) {
		const property = properties[key];

		if (property.required && isEmpty(values[key])) {
			check = false;
			break;
		}

		if (property.type === 'object') {
			check = checkPropertiesRecursively(
				property.properties,
				values[key]
			);

			if (!check) {
				break;
			}
		}
	}

	return check;
};

/**
 * Get the trigger name.
 *
 * @param {string} triggerSlug The trigger slug.
 *
 * @return {string} The trigger name.
 */
export const getTriggerName = (triggerSlug: string) => {
	const groups = Config.triggersGroups;

	for (const groupSlug in groups) {
		const group = groups[groupSlug];

		if (keys(group.triggers).includes(triggerSlug)) {
			return group.triggers[triggerSlug].name;
		}
	}

	return '';
};

/**
 * Check if trigger is exist.
 *
 * @param {string} triggerSlug The trigger slug.
 *
 * @return {boolean} The result of the check.
 */
export const isTriggerExist = (triggerSlug: string) => {
	const groups = Config.triggersGroups;

	for (const groupSlug in groups) {
		const group = groups[groupSlug];

		if (keys(group.triggers).includes(triggerSlug)) {
			return true;
		}
	}

	return false;
};

/**
 * Get the trigger data.
 *
 * @param {string} triggerSlug The trigger slug.
 *
 * @return {string} The trigger data.
 */
export const convertDate = (dateString: string) => {
	let date = new Date(dateString);

	if (isNaN(date.getTime())) {
		date = new Date(`${dateString}Z`);
	}

	if (isNaN(date.getTime())) {
		return dateString;
	}

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true,
	};

	// Format the date in the user's local time zone
	return date.toLocaleDateString(undefined, options);
};

export * from './history';

export * from './icons';
