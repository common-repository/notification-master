/**
 * WordPress Dependencies
 */
import { createContext, useContext } from 'react';

/**
 * Internal dependencies
 */
import type { NotificationForm } from '../types';

export const NotificationContext = createContext<NotificationForm>(
	{} as NotificationForm
);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotification must be used within a NotificationProvider'
		);
	}
	return context;
};

export const NotificationProvider = NotificationContext.Provider;
