/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import {
	unstable_HistoryRouter as HistoryRouter,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';
import { notification, Modal } from 'antd';
import { ConfigProvider } from 'antd';
import { map, size, filter } from 'lodash';
import { motion } from 'framer-motion';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

/**
 * Internal dependencies
 */
import { Nav, ProAlert } from '@Components';
import { getHistory } from '@Utils';
import './style.scss';
import Home from './home';
import Settings from './settings';
import Notifications from './notifications';
import Notification from './notification';
import DebugLog from './debug-log';
import NotificationLog from './notification-log';
import WebPushSubscriptions from './webpush-subscriptions';
import type { Pages, Page } from './types';
import '@Integrations';
import { getPath } from '@Utils';
import config from '@Config';

export const pages = applyFilters('NotificationsMaster.Pages', [
	{
		path: '/',
		slug: 'home',
		title: __('Home', 'notification-master'),
		component: Home,
	},
	{
		path: '/notifications',
		slug: 'notifications',
		title: __('Notifications', 'notification-master'),
		component: Notifications,
	},
	{
		path: '/notifications/:id',
		slug: 'notifications',
		title: __('Notifications', 'notification-master'),
		component: Notification,
		hidden: true,
	},
	{
		path: '/webpush-subscriptions',
		slug: 'webpush-subscriptions',
		title: __('Subscriptions', 'notification-master'),
		component: WebPushSubscriptions,
	},
	{
		path: '/settings/:tab?',
		slug: 'settings',
		title: __('Settings', 'notification-master'),
		component: Settings,
	},
	{
		path: '/notification-log',
		slug: 'notification-log',
		title: __('Notification Log', 'notification-master'),
		component: NotificationLog,
	},
	{
		path: '/debug-log',
		slug: 'debug-log',
		title: __('Debug Log', 'notification-master'),
		component: DebugLog,
	},
]) as Pages;

const Notices: React.FC = () => {
	const { notices } = useSelect((select) => ({
		notices: select('notification-master/core').getNotices(),
	}));
	const { deleteNotice } = useDispatch('notification-master/core');
	const [api, contextHolder] = notification.useNotification();

	useEffect(() => {
		if (!size(notices)) {
			return;
		}

		map(notices, (notice, id) => {
			const { message, description, type, duration } = notice;
			api[type]({
				message: message,
				duration: duration || 6,
				description: description,
				onClose: () => deleteNotice(id),
				placement: 'bottomRight',
			});
		});
	}, [notices]);

	return contextHolder;
};

const AntProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#E67A18',
					fontSize: 14,
				},
				components: {
					Button: {
						borderRadius: 4,
						colorPrimary: '#312a30',
						colorPrimaryHover: '#E67A18',
						defaultShadow: 'none',
						primaryShadow: 'none',
						algorithm: false,
					},
					Input: {
						paddingBlock: 14,
						paddingInline: 14,
					},
					Typography: {
						colorLink: '#E67A18',
					},
				},
			}}
		>
			{children}
		</ConfigProvider>
	);
};

const Page = ({ slug, component: Component }: Page) => {
	const { proAlert } = useSelect((select) => ({
		proAlert: select('notification-master/core').getProAlert(),
	}));
	const { toggleProAlert } = useDispatch('notification-master/core');
	const navigate = useNavigate();

	const handleClick = useCallback(
		(slug, submenuItem) => (e) => {
			e.preventDefault();
			navigate(getPath(slug));
			submenuItem?.classList.add('current');
			const siblings = Array.from(
				submenuItem?.parentElement?.children || []
			);
			siblings.forEach((sibling) => {
				if (sibling !== submenuItem) {
					// @ts-ignore sibling is not null
					sibling.classList.remove('current');
				}
			});
		},
		[]
	);

	useEffect(() => {
		const handlers = new Map();
		// Pages without repeating slugs
		const pagesSlug = map(
			filter(pages, (page) => !page.hidden),
			'slug'
		);

		pagesSlug.forEach((page) => {
			const slug = page;
			// Query the link element where href has page = slug
			const link = document.querySelector(
				`.wp-submenu-wrap a[href*="ntfm-${slug}"]`
			);

			if (!link || !link.parentElement) {
				return;
			}

			const handler = handleClick(slug, link.parentElement);
			handlers.set(link, handler);
			link.addEventListener('click', handler);
		});

		return () => {
			handlers.forEach((handler, link) => {
				link.removeEventListener('click', handler);
			});
		};
	}, [handleClick]);

	return (
		<div
			className={`notification-master-page notification-master-page__${slug}`}
		>
			<Modal
				title={false}
				open={proAlert}
				onCancel={() => toggleProAlert(false)}
				footer={null}
				zIndex={9999999}
			>
				<ProAlert />
			</Modal>
			<FloatButton
				icon={<QuestionCircleOutlined />}
				onClick={() => {
					const siteURL = config.ntfmSiteUrl;
					window.open(`${siteURL}/docs/getting-started`, '_blank');
				}}
				tooltip={__('Help', 'notification-master')}
			/>
			<Notices />
			<Nav />
			<AntProvider>
				<motion.div className="notification-master-page__content">
					<Component />
				</motion.div>
			</AntProvider>
		</div>
	);
};

const Pages: React.FC = () => {
	return (
		<div className="notification-master__pages">
			{/* @ts-ignore */}
			<HistoryRouter history={getHistory()}>
				<Routes>
					{pages.map((page) => (
						<Route
							key={page.slug}
							path={page.path}
							element={<Page {...page} />}
						/>
					))}
				</Routes>
			</HistoryRouter>
		</div>
	);
};

export default Pages;
