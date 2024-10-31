/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useNavigate } from 'react-router-dom';
import {
	Table,
	Tooltip,
	Button,
	Popconfirm,
	Switch,
	Select,
	Flex,
	Input,
	Typography,
	Empty,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { CopyOutlined } from '@ant-design/icons';
import Icon, {
	NotificationOutlined,
	PlusCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';

/**
 * Internal dependencies
 */
import './style.scss';
import { getPath, getTriggerName, isTriggerExist, convertDate } from '@Utils';
import type { ListNotification } from '../types';
import { usePageTitle } from '@Hooks';

interface TableDataType {
	key: number;
	trigger: string;
	title: string;
	status: JSX.Element;
	date: string;
	actions: JSX.Element;
}

type ColumnsType<T> = TableProps<T>['columns'];

const columns: ColumnsType<TableDataType> = [
	{
		title: __('Title', 'notification-master'),
		dataIndex: 'title',
		width: '30%',
	},
	{
		title: __('Trigger', 'notification-master'),
		dataIndex: 'trigger',
		width: '10%',
	},
	{
		title: __('Status', 'notification-master'),
		dataIndex: 'status',
		width: '10%',
	},
	{
		title: __('Date', 'notification-master'),
		dataIndex: 'date',
		width: '20%',
	},
	{
		title: __('Actions', 'notification-master'),
		dataIndex: 'actions',
		width: '30%',
	},
];

const Notifications: React.FC = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [postStatus, setPostStatus] = useState('publish, draft');
	const [selectedAction, setSelectedAction] = useState('' as string);
	const [search, setSearch] = useState('' as string);
	const [searchTrigger, setSearchTrigger] = useState(false);
	const [sortBy, setSortBy] = useState('date');
	const [sortOrder, setSortOrder] = useState('desc');
	const [isApplying, setIsApplying] = useState(false);
	const [selectedNotifications, setSelectedNotifications] = useState<
		number[]
	>([]);
	const [duplicateId, setDuplicateId] = useState<number | null>(null);
	const [changeStatusId, setChangeStatusId] = useState<number | null>(null);
	const navigate = useNavigate();
	const { addNotice } = useDispatch('notification-master/core');
	const {
		saveEntityRecord,
		deleteEntityRecord,
		editEntityRecord,
		saveEditedEntityRecord,
	} = useDispatch(coreStore);

	// Set the page title
	usePageTitle(__('Notifications', 'notification-master'));

	// The arguments to pass to the `getEntityRecords` selector
	const recordArgs = [
		'postType',
		'ntfm_notification',
		{
			status: postStatus,
			per_page: perPage,
			page,
		},
	];

	const { notifications, isResolving, count } = useSelect(
		(select) => {
			const {
				getEntityRecords,
				// @ts-ignore - TS doesn't know about the `hasFinishedResolution` selector
				hasFinishedResolution,
			} = select(coreStore);

			const { getTotalNotifications } = select(
				'notification-master/core'
			);

			if (sortBy && sortOrder) {
				recordArgs[2]['orderby'] = sortBy;
				recordArgs[2]['order'] = sortOrder;
			}

			if (search) {
				recordArgs[2]['search'] = search;
			}

			// @ts-ignore
			const notifications = getEntityRecords(...recordArgs);

			return {
				notifications: notifications as ListNotification[],
				isResolving: !hasFinishedResolution(
					'getEntityRecords',
					recordArgs
				),
				count: getTotalNotifications(),
			};
		},
		[page, perPage, sortBy, sortOrder, searchTrigger]
	);

	const changeNotificationStatus = async (id: number, status: string) => {
		setChangeStatusId(id);
		try {
			editEntityRecord('postType', 'ntfm_notification', id, {
				status: 'draft' === status ? 'publish' : 'draft',
			});
			const res = await saveEditedEntityRecord(
				'postType',
				'ntfm_notification',
				id,
				{}
			);

			if (res) {
				addNotice({
					type: 'success',
					message: __(
						'Notification status changed successfully',
						'notification-master'
					),
				});
			} else {
				addNotice({
					type: 'error',
					message: __(
						'Could not change notification status',
						'notification-master'
					),
				});
			}
		} catch (error) {
			addNotice({
				type: 'error',
				message: __(
					'Could not change notification status',
					'notification-master'
				),
			});
		}
		setChangeStatusId(null);
	};

	const deleteNotification = async (id: number) => {
		try {
			const res = await deleteEntityRecord(
				'postType',
				'ntfm_notification',
				id.toString(),
				{}
			);

			if (res) {
				addNotice({
					type: 'success',
					message: __(
						'Notification deleted successfully',
						'notification-master'
					),
				});
			} else {
				addNotice({
					type: 'error',
					message: __(
						'Could not delete notification',
						'notification-master'
					),
				});
			}
		} catch (error) {
			addNotice({
				type: 'error',
				message: __(
					'Could not delete notification',
					'notification-master'
				),
			});
		}
	};

	const duplicateNotification = async (id: number) => {
		if (!notifications || duplicateId === id) {
			return;
		}
		setDuplicateId(id);
		try {
			const post = notifications.find(
				(notification) => notification.id === id
			);

			if (!post) {
				return;
			}

			const newPostData = {
				// translators: %s: post title
				title: sprintf(
					__('(Copy) %s', 'notification-master'),
					post.title.rendered
				),
				trigger: post.trigger,
				connections: post.connections,
				status: 'draft',
			};

			const newPost = await saveEntityRecord(
				'postType',
				'ntfm_notification',
				newPostData
			);

			if (newPost.id) {
				addNotice({
					type: 'success',
					message: __(
						'Notification duplicated successfully',
						'notification-master'
					),
				});
			} else {
				addNotice({
					type: 'error',
					message: __(
						'Could not duplicate notification',
						'notification-master'
					),
				});
			}

			setPage(1);
		} catch (error) {
			addNotice({
				type: 'error',
				message: __(
					'Could not duplicate notification',
					'notification-master'
				),
			});
		}
		setDuplicateId(null);
	};

	const handleBulkAction = async (action: string) => {
		if (!selectedNotifications.length) {
			addNotice({
				type: 'error',
				message: __(
					'Please select at least one notification',
					'notification-master'
				),
			});
			return;
		}

		setIsApplying(true);
		try {
			switch (action) {
				case 'delete':
					await Promise.all(
						selectedNotifications.map((id) =>
							deleteEntityRecord(
								'postType',
								'ntfm_notification',
								id.toString(),
								{}
							)
						)
					);
					addNotice({
						type: 'success',
						message: __(
							'Notifications deleted successfully',
							'notification-master'
						),
					});
					break;
				case 'deactivate':
					await Promise.all(
						selectedNotifications.map((id) =>
							editEntityRecord(
								'postType',
								'ntfm_notification',
								id,
								{
									status: 'draft',
								}
							)
						)
					);
					await Promise.all(
						selectedNotifications.map((id) =>
							saveEditedEntityRecord(
								'postType',
								'ntfm_notification',
								id,
								{}
							)
						)
					);
					addNotice({
						type: 'success',
						message: __(
							'Notifications inactivated successfully',
							'notification-master'
						),
					});
					break;
				case 'activate':
					await Promise.all(
						selectedNotifications.map((id) =>
							editEntityRecord(
								'postType',
								'ntfm_notification',
								id,
								{
									status: 'publish',
								}
							)
						)
					);
					await Promise.all(
						selectedNotifications.map((id) =>
							saveEditedEntityRecord(
								'postType',
								'ntfm_notification',
								id,
								{}
							)
						)
					);
					addNotice({
						type: 'success',
						message: __(
							'Notifications activated successfully',
							'notification-master'
						),
					});
					break;
				default:
					break;
			}
		} catch (error) {
			addNotice({
				type: 'error',
				message: __(
					'Could not apply bulk action',
					'notification-master'
				),
			});
		}
		setIsApplying(false);
	};

	const prepareNotification = (
		notification: ListNotification
	): TableDataType => {
		const { id, title, status, date } = notification;
		return {
			key: id,
			title: title.rendered,
			trigger: notification.trigger
				? isTriggerExist(notification.trigger)
					? getTriggerName(notification.trigger)
					: notification.trigger
				: __('None', 'notification-master'),
			status: (
				<>
					{isTriggerExist(notification.trigger) && (
						<Switch
							checked={'publish' === status}
							onChange={() =>
								changeNotificationStatus(id, status)
							}
							checkedChildren={__('On', 'notification-master')}
							unCheckedChildren={__('Off', 'notification-master')}
							loading={changeStatusId === id}
						/>
					)}
					{!isTriggerExist(notification.trigger) && (
						<Tooltip
							title={__(
								'Trigger disabled from settings',
								'notification-master'
							)}
						>
							<Flex align="center" gap="small">
								<Switch
									checked={false}
									checkedChildren={__(
										'On',
										'notification-master'
									)}
									unCheckedChildren={__(
										'Off',
										'notification-master'
									)}
									disabled={true}
								/>
								<Icon
									component={
										InfoCircleOutlined as React.ForwardRefExoticComponent<any>
									}
									style={{
										fontSize: 20,
										color: 'rgb(250, 173, 20)',
										cursor: 'pointer',
									}}
								/>
							</Flex>
						</Tooltip>
					)}
				</>
			),
			// translators: %s: date
			date: sprintf(
				__('Published on %s', 'notification-master'),
				convertDate(date)
			),
			actions: (
				<div className="notification-master__integration--actions">
					{isTriggerExist(notification.trigger) && (
						<>
							<Tooltip title={__('Edit', 'notification-master')}>
								<Button
									type="primary"
									icon={<EditOutlined />}
									onClick={() => {
										navigate(getPath(`notifications`, id));
									}}
									shape="circle"
								/>
							</Tooltip>
							<Tooltip
								title={__('Duplicate', 'notification-master')}
							>
								<Button
									type="primary"
									icon={<CopyOutlined />}
									onClick={() => duplicateNotification(id)}
									shape="circle"
									loading={duplicateId === id}
								/>
							</Tooltip>
						</>
					)}
					<Popconfirm
						title={__('Are you sure?', 'notification-master')}
						onConfirm={() => deleteNotification(id)}
						okText={__('Yes', 'notification-master')}
						cancelText={__('No', 'notification-master')}
					>
						<Tooltip title={__('Delete', 'notification-master')}>
							<Button
								type="primary"
								danger
								icon={<DeleteOutlined />}
								shape="circle"
							/>
						</Tooltip>
					</Popconfirm>
				</div>
			),
		};
	};

	return (
		<div className="notification-master__integrations">
			<div className="notification-master__integrations--header">
				<h2 className="notification-master-heading">
					<Icon
						component={
							NotificationOutlined as React.ForwardRefExoticComponent<any>
						}
						width={20}
						height={20}
					/>
					{__('Notifications', 'notification-master')}
				</h2>
				<div className="notification-master__integrations--header--actions">
					<Button
						type="primary"
						onClick={() =>
							navigate(getPath(`notifications`, 'new'))
						}
						size="large"
						icon={<PlusCircleOutlined />}
					>
						{__('Add New Notification', 'notification-master')}
					</Button>
				</div>
			</div>
			<div className="notification-master__integrations--table">
				<div className="notification-master__integrations--table--status">
					<Flex
						gap={'small'}
						align="center"
						justify="space-between"
						style={{ marginBottom: '20px' }}
					>
						<Flex gap={'small'} align="center">
							<div>
								<Typography.Text strong>
									{__('Status', 'notification-master')}:{' '}
								</Typography.Text>
								<Select
									options={[
										{
											label: __(
												'All',
												'notification-master'
											),
											value: 'publish, draft',
										},
										{
											label: __(
												'Active',
												'notification-master'
											),
											value: 'publish',
										},
										{
											label: __(
												'Inactive',
												'notification-master'
											),
											value: 'draft',
										},
									]}
									value={postStatus}
									onChange={(value) => setPostStatus(value)}
									style={{ minWidth: 120 }}
								/>
							</div>
							<div>
								<Typography.Text strong>
									{__('Sort by', 'notification-master')}:{' '}
								</Typography.Text>
								<Select
									options={[
										{
											label: __(
												'Date',
												'notification-master'
											),
											value: 'date',
										},
										{
											label: __(
												'Title',
												'notification-master'
											),
											value: 'title',
										},
									]}
									value={sortBy}
									onChange={(value) => setSortBy(value)}
									style={{ minWidth: 120 }}
								/>
							</div>
							<div>
								<Typography.Text strong>
									{__('Order', 'notification-master')}:{' '}
								</Typography.Text>
								<Select
									options={[
										{
											label: __(
												'Descending',
												'notification-master'
											),
											value: 'desc',
										},
										{
											label: __(
												'Ascending',
												'notification-master'
											),
											value: 'asc',
										},
									]}
									value={sortOrder}
									onChange={(value) => setSortOrder(value)}
									style={{ minWidth: 120 }}
								/>
							</div>
						</Flex>
						<Flex gap={'small'} align="center">
							<Input
								placeholder={__(
									'Search',
									'notification-master'
								)}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								style={{ width: '200px' }}
							/>
							<Button
								type="primary"
								onClick={() => {
									setPage(1);
									setSearchTrigger(!searchTrigger);
								}}
							>
								{__('Search', 'notification-master')}
							</Button>
						</Flex>
					</Flex>
				</div>
				<Flex
					className="notification-master__integrations--table--filters"
					justify="space-between"
					align="center"
				>
					<Flex
						className="notification-master__integrations--table--filters--selected"
						gap={'small'}
					>
						<Select
							options={[
								{
									label: __(
										'Bulk Actions',
										'notification-master'
									),
									value: '',
									disabled: true,
								},
								{
									label: __('Delete', 'notification-master'),
									value: 'delete',
								},
								{
									label: __(
										'Deactive',
										'notification-master'
									),
									value: 'deactivate',
								},
								{
									label: __(
										'Activate',
										'notification-master'
									),
									value: 'activate',
								},
							]}
							value={selectedAction}
							onChange={(value) => setSelectedAction(value)}
						/>
						<Button
							type="primary"
							onClick={() => handleBulkAction(selectedAction)}
							loading={isApplying}
						>
							{__('Apply', 'notification-master')}
						</Button>
					</Flex>
				</Flex>
				<Table
					loading={isResolving}
					columns={columns}
					dataSource={
						notifications
							? notifications.map((notification) =>
									prepareNotification(notification)
								)
							: []
					}
					pagination={{
						total: count,
						current: page,
						pageSize: perPage,
						showSizeChanger: true,
						showQuickJumper: true,
						onChange: (page, pageSize) => {
							setPage(page);
							setPerPage(pageSize);
						},
					}}
					rowSelection={{
						selectedRowKeys: selectedNotifications,
						onChange: (selectedRowKeys: React.Key[]) => {
							setSelectedNotifications(
								selectedRowKeys as number[]
							);
						},
					}}
					locale={{
						emptyText: [
							<Empty
								key="empty"
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={__(
									'No notifications found',
									'notification-master'
								)}
							/>,
						],
					}}
				/>
			</div>
		</div>
	);
};

export default Notifications;
