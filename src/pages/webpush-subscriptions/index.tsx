/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

/**
 * External dependencies
 */
import { Result, Button, Typography, Flex, Badge } from 'antd';
import Icon, { UserOutlined } from '@ant-design/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import { usePageTitle } from '@Hooks';
import config from '@Config';

const Subscriptions: React.FC = () => {
	usePageTitle(__('Subscriptions', 'notification-master'));

	return (
		<>
			<Flex
				justify="space-between"
				align="center"
				style={{
					marginBottom: 20,
					padding: '25px 20px',
					backgroundColor: '#fff',
					borderRadius: 5,
				}}
			>
				<h2
					className="notification-master-heading"
					style={{ margin: 0 }}
				>
					<Icon
						component={
							UserOutlined as React.ForwardRefExoticComponent<any>
						}
						width={20}
						height={20}
					/>
					{__('Manage Web Push Subscriptions', 'notification-master')}
				</h2>
				<Flex gap={10} align="center">
					<Typography.Text strong style={{ fontSize: 16 }}>
						{__('Total Subscriptions', 'notification-master')}
					</Typography.Text>
					<Badge
						showZero
						count={config.subscriptionCount}
						style={{ backgroundColor: '#52c41a' }}
						className="notification-master__badge--subscriptions"
					/>
				</Flex>
			</Flex>
			<div className="notification-master__Subscriptions">
				{!config.isPro && (
					<div
						className="notification-master__subscriptions--pro"
						style={{ position: 'relative' }}
					>
						<div
							className="notification-master__subscriptions--pro--bg"
							style={{
								backgroundImage: `url(${config.assetsUrl}/images/bg.png)`,
							}}
						>
							<img
								src={`${config.assetsUrl}/images/bg.png`}
								alt=""
							/>
						</div>
						<div
							className="notification-master__subscriptions--pro--content"
							style={{
								position: 'absolute',
								width: '40%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								borderRadius: 5,
								padding: 20,
								boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
							}}
						>
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
										{__(
											'Unlock premium features',
											'notification-master'
										)}
									</Typography.Title>,
									<Typography.Text key="text">
										{__(
											'Upgrade to Notification Master Pro to unlock premium features and integrations.',
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
											window.open(
												`${config.ntfmSiteUrl}/pricing`,
												'_blank'
											);
										}}
									>
										{__(
											'Upgrade to Pro',
											'notification-master'
										)}
									</Button>
								}
							/>
						</div>
					</div>
				)}
				{
					applyFilters(
						'NotificationMaster.SubscriptionsPage',
						null
					) as any
				}
			</div>
		</>
	);
};

export default Subscriptions;
