export type Connections = {
	[key: string]: Connection;
};

export type Connection = {
	enabled: boolean;
	name: string;
	integration: string;
	settings: {
		[key: string]: any;
	};
};

export type ConnectionsContext = {
	connections: Connections;
	addConnection: (connection: Connection) => void;
	updateConnection: (id: string, field: { [key: string]: any }) => void;
	getConnection: (id: string) => Connection;
	deleteConnection: (id: string) => void;
};
