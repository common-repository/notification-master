/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import Icon, {
	SettingOutlined,
	ThunderboltOutlined,
	GlobalOutlined,
	BellOutlined,
} from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { BeatLoader } from 'react-spinners';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '@Store';
import { NTFM_NAMESPACE } from '@Constants';
import { usePageTitle } from '@Hooks';
import { getPath } from '@Utils';
import Triggers from './triggers';
import General from './general';
import WebPush from './webpush';

const Settings: React.FC = () => {
	const { settings, isResolving } = useSelect((select) => {
		const { hasFinishedResolution, getSettings } = select(
			'notification-master/core'
		);
		const settings = getSettings();
		return {
			isResolving: !hasFinishedResolution('getSettings'),
			settings,
		};
	}, []);
	const { addNotice } = useDispatch('notification-master/core');
	const [isSaving, setIsSaving] = useState(false);
	const { tab } = useParams<{ tab: string }>();
	const navigate = useNavigate();

	usePageTitle(__('Settings', 'notification-master'));

	if (isResolving) {
		return (
			<div className="notification-master__settings--loading">
				<BeatLoader color="var(--notification-master-color-primary)" />
			</div>
		);
	}

	const saveSettings = async () => {
		if (isSaving) return;
		setIsSaving(true);
		try {
			// @ts-ignore - TS doesn't recognize the settings object
			const response = await apiFetch({
				path: `${NTFM_NAMESPACE}/settings`,
				method: 'POST',
				data: { settings },
			});

			addNotice({
				type: 'success',
				message: __(
					'Settings saved successfully',
					'notification-master'
				),
			});
			window.location.reload();
		} catch (error) {
			addNotice({
				type: 'error',
				message: __('Failed to save settings', 'notification-master'),
			});
		} finally {
			setIsSaving(false);
		}
	};

	const items = [
		{
			key: 'general',
			label: __('General', 'notification-master'),
			children: <General />,
			icon: <GlobalOutlined />,
		},
		{
			key: 'triggers',
			label: __('Triggers', 'notification-master'),
			children: <Triggers />,
			icon: <ThunderboltOutlined />,
		},
		{
			key: 'webpush',
			label: __('Web Push', 'notification-master'),
			children: <WebPush />,
			icon: <BellOutlined />,
		},
	];

	return (
		<>
			<h2 className="notification-master-heading">
				<Icon
					component={
						SettingOutlined as React.ForwardRefExoticComponent<any>
					}
					width={20}
					height={20}
				/>
				{__('Settings', 'notification-master')}
			</h2>
			<div className="notification-master__settings">
				<Tabs
					defaultActiveKey={tab || 'general'}
					items={items}
					onChange={(key) => {
						navigate(getPath('settings', null, key));
					}}
					tabBarStyle={{
						marginBottom: 0,
						padding: '10px 20px 0 20px',
						fontSize: 16,
						fontWeight: 500,
						color: 'var(--notification-master-help-text-color)',
					}}
					tabBarExtraContent={
						<Button
							type="primary"
							onClick={saveSettings}
							loading={isSaving}
						>
							{__('Save', 'notification-master')}
						</Button>
					}
				/>
			</div>
		</>
	);
};

export default Settings;
