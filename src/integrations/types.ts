export type Integration = {
	name: string;
	component: React.FC<{
		settings: Settings;
		onChange: (setting: any) => void;
	}>;
	icon: string;
	properties: IntegrationProperties;
	available: boolean;
	configured: boolean;
};

export type IntegrationProperties = {
	[key: string]: IntegrationProperty;
};

export type IntegrationProperty = {
	type: string;
	required: boolean;
};

export type Settings = {
	[key: string]: any;
};

export type IntegrationsList = {
	[key: string]: Integration;
};
