import type { Connections } from '@ConnectionsStore';

export type Pages = Page[];

export interface Page {
	path: string;
	slug: string;
	title: string;
	hidden?: boolean;
	component: React.FC;
}

export type IntegrationSettings = {
	name: string;
	singular_name: string;
	description: string;
	settings: Settings;
};

export type Settings = {
	[key: string]: Setting;
};

export type Setting = {
	label: string;
	type: string;
	options?: Option[];
	default?: any;
	required?: boolean;
	condition?: Condition[];
	show_in_table?: boolean;
};

export type Option = {
	label: string;
	value: string;
};

export type Condition = {
	key: string;
	value: string | number | boolean;
	operator: string;
};

export type Notification = {
	date: string;
	date_gmt: string;
	guid: {
		rendered: string;
		raw: string;
	};
	id: number;
	connections: Connections;
	link: string;
	modified: string;
	modified_gmt: string;
	password: string;
	slug: string;
	status: string;
	template: string;
	title: string;
	trigger: string;
	triggerGroup: string;
	type: string;
};

export type ListNotification = {
	date: string;
	date_gmt: string;
	guid: {
		rendered: string;
		raw: string;
	};
	id: number;
	connections: Connections;
	link: string;
	modified: string;
	modified_gmt: string;
	password: string;
	slug: string;
	status: string;
	template: string;
	title: { rendered: string; raw: string };
	trigger: string;
	triggerGroup: string;
	type: string;
};

export type NotificationForm = {
	record: Notification;
	onEdit: (record: { [key: string]: any }) => void;
	onSave: () => void;
	isSaving: boolean;
	isNew: boolean;
	hasEdits: boolean;
	onDelete: () => void;
	isDeleting: boolean;
};

export type MergeTagsGroups = {
	[key: string]: MergeTagsGroup;
};

export type MergeTagsGroup = {
	label: string;
	merge_tags: MergeTags;
};

export type MergeTags = {
	[key: string]: MergeTag;
};

export type MergeTag = {
	name: string;
	description: string;
	trigger: false | string;
};

export type Log = {
	id: number;
	date: string;
	type: 'error' | 'info' | 'debug';
	content: {
		[key: string]: any;
	};
};

export type NotificationLog = {
	id: number;
	integration: string;
	status: 'error' | 'success';
	content: {
		notification_name: string;
		trigger: string;
		trigger_name: string;
		[key: string]: any;
	};
	date: string;
};

export type Subscription = {
	id: number;
	user: {
		id: number;
		username: string;
		url: string;
	};
	user_agent: string;
	browser: string;
	operating_system: string;
	device: string;
	ip_address: string;
	created_at: string;
	updated_at: string;
};
