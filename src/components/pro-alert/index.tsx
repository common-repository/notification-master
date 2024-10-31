/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { Result, Button, Typography } from 'antd';

/**
 * Internal dependencies
 */
import config from '@Config';

const ProAlert: React.FC = () => {
	return (
		<Result
			icon={
				<img
					src={`${config.assetsUrl}/images/logo.gif`}
					alt=""
					style={{ width: 100 }}
				/>
			}
			title={[
				<Typography.Title
					level={3}
					key="title"
					style={{ textTransform: 'capitalize' }}
				>
					{__('Unlock premium features', 'notification-master')}
				</Typography.Title>,
				<Typography.Text key="text">
					{__(
						'Unlock premium features and integrations by upgrading to Notification Master Pro.',
						'notification-master'
					)}
				</Typography.Text>,
			]}
			extra={
				<Button
					type="primary"
					style={{
						backgroundColor: '#E67A18',
						fontWeight: 600,
						borderRadius: 5,
						textTransform: 'uppercase',
					}}
					size="large"
					onClick={() => {
						window.open(`${config.ntfmSiteUrl}/pricing`, '_blank');
					}}
				>
					{__('Upgrade to Pro', 'notification-master')}
				</Button>
			}
		/>
	);
};

export default ProAlert;
