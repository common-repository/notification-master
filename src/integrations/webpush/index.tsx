/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { Button, Input, Typography, Select, Flex } from 'antd';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../types';
import { getIntegration } from '@Integrations';
import { MergeTagsIcon } from '../components';
import config from '@Config';

const WebPushIntegration: React.FC<{
	settings: Settings;
	onChange: (setting: any) => void;
}> = ({ settings, onChange }) => {
	const { title, message, icon, image, url, urgency } = settings;
	const { properties } = getIntegration('webpush');
	const { toggleMergeTags } = useDispatch('notification-master/core');
	const { ntfmSiteUrl } = config;

	const changeHandler = (key: string, value: any) => {
		onChange({
			[key]: value,
		});
	};

	return (
		<Flex vertical gap={10}>
			<Typography.Title level={5} className="ntfm-custom-title">
				{__('Notification Settings', 'notification-master')}
			</Typography.Title>
			<Typography.Text type="secondary">
				{__(
					'Read the documentation to learn more about how to setup webpush notifications.',
					'notification-master'
				)}{' '}
				<a href={`${ntfmSiteUrl}/docs/web-push/`} target="_blank">
					{__('Find out more', 'notification-master')}
				</a>
			</Typography.Text>
			<div className="notification-master__integration--settings">
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.title.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Title', 'notification-master')}
					</Typography.Title>
					<Input
						value={title}
						onChange={(e) => changeHandler('title', e.target.value)}
						placeholder={__(
							'Enter the title of the notification',
							'notification-master'
						)}
						addonAfter={<MergeTagsIcon />}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.message.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Message', 'notification-master')}
					</Typography.Title>
					<Button
						onClick={() => toggleMergeTags(true)}
						style={{ margin: '10px 0' }}
						className="notification-master__integration--settings__field__input__button"
					>
						{__('Merge Tags', 'notification-master')}
					</Button>
					<Input.TextArea
						value={message}
						onChange={(e) =>
							changeHandler('message', e.target.value)
						}
						placeholder={__(
							'Enter the message of the notification',
							'notification-master'
						)}
						autoSize={{ minRows: 4 }}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.icon.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Icon', 'notification-master')}
					</Typography.Title>
					<Input
						value={icon}
						onChange={(e) => changeHandler('icon', e.target.value)}
						placeholder={__(
							'Enter the icon URL of the notification',
							'notification-master'
						)}
						addonAfter={<MergeTagsIcon />}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.image.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Image', 'notification-master')}
					</Typography.Title>
					<Input
						value={image}
						onChange={(e) => changeHandler('image', e.target.value)}
						placeholder={__(
							'Enter the image URL of the notification',
							'notification-master'
						)}
						addonAfter={<MergeTagsIcon />}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.url.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('URL', 'notification-master')}
					</Typography.Title>
					<Input
						value={url}
						onChange={(e) => changeHandler('url', e.target.value)}
						placeholder={__(
							'Enter the URL of the notification',
							'notification-master'
						)}
						addonAfter={<MergeTagsIcon />}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.urgency.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Urgency', 'notification-master')}
					</Typography.Title>
					<Select
						value={urgency}
						onChange={(value) => changeHandler('urgency', value)}
						placeholder={__(
							'Select the urgency of the notification',
							'notification-master'
						)}
						options={[
							{
								value: 'very-low',
								label: __('Very Low', 'notification-master'),
							},
							{
								value: 'low',
								label: __('Low', 'notification-master'),
							},
							{
								value: 'normal',
								label: __('Normal', 'notification-master'),
							},
							{
								value: 'high',
								label: __('High', 'notification-master'),
							},
						]}
					/>
				</div>
			</div>
		</Flex>
	);
};

addFilter(
	'NotificationMaster.Integration',
	'NotificationMaster.WebPushIntegration',
	(integration, slug) => {
		if (slug === 'webpush') {
			const { webpushConfigured } =
				window['NotificationsMasterConfig'] || {};
			return {
				...integration,
				component: WebPushIntegration,
				configured: webpushConfigured,
				available: true,
			};
		}

		return integration;
	}
);
