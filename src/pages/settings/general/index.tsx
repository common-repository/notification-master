/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { Switch, Typography, Input } from 'antd';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

const General: React.FC = () => {
	const { settings } = useSelect((select) => {
		const { hasFinishedResolution, getSettings } = select(
			'notification-master/core'
		);
		const settings = getSettings();
		return {
			isResolving: !hasFinishedResolution('getSettings'),
			settings,
		};
	}, []);
	const { updateSetting } = useDispatch('notification-master/core');
	return (
		<>
			<div className="notification-master__settings--item">
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__(
							'Process notifications in the background',
							'notification-master'
						)}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, notifications will be processed in the background. This will improve the performance of your website.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.enable_background_processing}
						onChange={(checked) => {
							updateSetting(
								'enable_background_processing',
								checked
							);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__(
							'Delete Notification Logs Older Than: ',
							'notification-master'
						)}
					</Typography.Title>
					<Typography.Text>
						{
							/* translators: %s: Number of days */
							sprintf(
								__(
									'All notification logs older than {%s} days will be deleted.',
									'notification-master'
								),
								settings.notifications_delete_logs_every
							)
						}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Input
						type="number"
						value={settings.notifications_delete_logs_every}
						onChange={(e) => {
							updateSetting(
								'notifications_delete_logs_every',
								e.target.value
							);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__(
							'Delete Debug Logs Older Than: ',
							'notification-master'
						)}
					</Typography.Title>
					<Typography.Text>
						{
							/* translators: %s: Number of days */
							sprintf(
								__(
									'All debug logs older than {%s} days will be deleted.',
									'notification-master'
								),
								settings.delete_logs_every
							)
						}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Input
						type="number"
						value={settings.delete_logs_every}
						onChange={(e) => {
							updateSetting('delete_logs_every', e.target.value);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default General;
