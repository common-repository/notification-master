/**
 * WordPress Dependencies
 */
import { createContext, useContext } from 'react';

/**
 * Internal dependencies
 */
import type { ConnectionsContext as ConnectionsContextType } from './types';
export * from './types';

export const ConnectionsContext = createContext<ConnectionsContextType>(
	{} as ConnectionsContextType
);

export const useConnections = () => {
	const context = useContext(ConnectionsContext);
	if (!context) {
		throw new Error(
			'useConnections must be used within a ConnectionsProvider'
		);
	}
	return context;
};

export const ConnectionsProvider = ConnectionsContext.Provider;
