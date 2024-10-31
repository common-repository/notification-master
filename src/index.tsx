/**
 * Wordpress dependencies
 */
import { render } from '@wordpress/element';

/**
 * Internals
 */
import Pages from '@Pages';
import '@Store';

render(<Pages />, document.getElementById('notification-master-admin'));
