export type Config = {
	adminUrl: string;
	ajaxUrl: string;
	assetsUrl: string;
	nonce: string;
	parentPageSlug: string;
	postTypes: PostType[];
	taxonomies: Taxonomy[];
	commentTypes: Comment[];
	totalNotifications: number;
	triggersGroups: TriggersGroups;
	integrations: IntegrationsList;
	ntfmSiteUrl: string;
	isPro: boolean;
	userRoles: RoleOptions;
	[other: string]: any;
};

export type RoleOptions = {
	[key: string]: Role;
};

export type Role = {
	description: string;
	label: string;
};

export type TriggersGroups = {
	[key: string]: TriggerGroup;
};

export type TriggerGroup = {
	label: string;
	triggers: Triggers;
};

export type Triggers = {
	[key: string]: Trigger;
};

export type Trigger = {
	name: string;
	slug: string;
	description: string;
};

export type Page = {
	slug: string;
	title: string;
};

export type PostType = {
	label: string;
	value: string;
};

export type Taxonomy = {
	label: string;
	value: string;
};

export type Comment = {
	label: string;
	value: string;
};

export type IntegrationsList = {
	[key: string]: Integration;
};

export type Integration = {
	name: string;
	slug: string;
	description: string;
	icon: string;
	properties: IntegrationProperties;
	configured: boolean;
};

export type IntegrationProperties = {
	[key: string]: IntegrationProperty;
};

export type IntegrationProperty = {
	type: string;
	required: boolean;
};
