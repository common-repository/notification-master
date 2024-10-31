/**
 * External dependencies
 */
import { createReduxStore, register } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import * as actions from './actions';
import * as selectors from './selectors';
import * as resolvers from './resolvers';
import reducer from './reducer';
import {
	DispatchFromMap,
	SelectFromMap,
	WPDataActions,
	WPDataSelectors,
} from './types';

const STORE_KEY = 'notification-master/core';
const config = {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
};
const store = createReduxStore(STORE_KEY, config);

export default store;
export * from './types';
register(store);

declare module '@wordpress/data' {
	function dispatch(
		key: typeof STORE_KEY
	): DispatchFromMap<typeof actions & WPDataActions>;
	function select(
		key: typeof STORE_KEY
	): SelectFromMap<typeof selectors> & WPDataSelectors;
	function useSelect<R>(
		selector: (customSelect: typeof select) => R,
		deps?: any[]
	): R;
	function useDispatch(
		key: typeof STORE_KEY
	): DispatchFromMap<typeof actions & WPDataActions>;
}
