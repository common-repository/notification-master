/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * External dependencies
 */
import {
	Table,
	Tooltip,
	Button,
	Modal,
	Flex,
	Popconfirm,
	Typography,
	Select,
} from 'antd';
import Icon, { FileExclamationOutlined, EyeOutlined } from '@ant-design/icons';
import { BeatLoader } from 'react-spinners';
import { isArray, isEmpty, set, isObject } from 'lodash';
import type { TableProps } from 'antd';

/**
 * Internal dependencies
 */
import './style.scss';
import type { NotificationLog } from '../types';
import { usePageTitle } from '@Hooks';
import { convertDate } from '@Utils';

type ColumnsType<T> = TableProps<T>['columns'];

const columns: ColumnsType<NotificationLog> = [
	{
		title: __('ID', 'notification-master'),
		dataIndex: 'id',
		key: 'id',
		width: '10%',
	},
	{
		title: __('Name', 'notification-master'),
		dataIndex: 'notification',
		key: 'notification',
		width: '20%',
	},
	{
		title: __('Integration', 'notification-master'),
		dataIndex: 'integration',
		key: 'integration',
		width: '20%',
	},
	{
		title: __('Status', 'notification-master'),
		dataIndex: 'log_status',
		key: 'log_status',
		width: '10%',
	},
	{
		title: __('Date', 'notification-master'),
		dataIndex: 'date',
		key: 'date',
		width: '20%',
	},
	{
		title: __('View', 'notification-master'),
		dataIndex: 'view',
		width: '20%',
	},
];
const NotificationLog: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [logs, setLogs] = useState<NotificationLog[]>([]);
	const [perPage, setPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [viewLog, setviewLog] = useState<NotificationLog | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [count, setCount] = useState(0);
	const { addNotice } = useDispatch('notification-master/core');
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedAction, setSelectedAction] = useState('');
	const [isApplying, setIsApplying] = useState(false);

	usePageTitle(__('Notification Log', 'notification-master'));

	const fetchLogs = async () => {
		setIsLoading(true);
		try {
			const response = (await apiFetch({
				path: addQueryArgs('/ntfm/v1/notification-logs', {
					per_page: perPage,
					page: currentPage,
				}),
			})) as any;

			if (response) {
				setLogs(isArray(response?.logs) ? response.logs : []);
				setCount(response?.count || 0);
			}
		} catch (error: any) {
			addNotice({
				type: 'error',
				message:
					error?.message ||
					__('An error occurred', 'notification-master'),
			});
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchLogs();
	}, [perPage, currentPage]);

	const deleteAllLogs = async () => {
		if (isDeleting) {
			return;
		}
		setIsDeleting(true);
		try {
			// @ts-ignore
			const response = await apiFetch({
				path: '/ntfm/v1/notification-logs',
				method: 'DELETE',
			});

			setLogs([]);
		} catch (error: any) {
			addNotice({
				type: 'error',
				message:
					error?.message ||
					__('An error occurred', 'notification-master'),
			});
		}

		setIsDeleting(false);
	};

	const handleBulkAction = async (action: string) => {
		if (action === 'delete') {
			if (isEmpty(selectedRowKeys)) {
				addNotice({
					type: 'error',
					message: __('Please select a log.', 'notification-master'),
				});
				return;
			}

			setIsApplying(true);

			try {
				// @ts-ignore
				const response = await apiFetch({
					path: addQueryArgs('/ntfm/v1/notification-logs'),
					method: 'DELETE',
					data: { ids: selectedRowKeys },
				});

				setSelectedRowKeys([]);
				fetchLogs();
			} catch (error: any) {
				addNotice({
					type: 'error',
					message:
						error?.message ||
						__('An error occurred', 'notification-master'),
				});
			} finally {
				setIsApplying(false);
			}
		}
	};

	if (isLoading && isEmpty(logs)) {
		return (
			<div className="notification-master__log--loading">
				<BeatLoader color="var(--notification-master-color-primary)" />
			</div>
		);
	}

	const parseIfJson = (value: any) => {
		if (typeof value === 'string') {
			try {
				return JSON.parse(value);
			} catch (error) {
				return value;
			}
		}

		if (isObject(value)) {
			return prepareContent(value);
		}

		return value;
	};

	const prepareContent = (content: any) => {
		const newContent = {};

		for (const key in content) {
			if (
				key === 'notification_name' ||
				key === 'trigger' ||
				key === 'trigger_name'
			) {
				continue;
			}

			set(newContent, key, parseIfJson(content[key]));
		}

		return newContent;
	};

	return (
		<>
			<h2 className="notification-master-heading">
				<Icon
					component={
						FileExclamationOutlined as React.ForwardRefExoticComponent<any>
					}
					width={20}
					height={20}
				/>
				{__('Notification Log', 'notification-master')}
			</h2>
			<div className="notification-master__log">
				{isEmpty(logs) ? (
					<Typography.Title level={5} style={{ textAlign: 'center' }}>
						{__('No logs found.', 'notification-master')}
					</Typography.Title>
				) : (
					<>
						<Flex gap={20} justify="space-between">
							<Flex gap={'small'}>
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
											label: __(
												'Delete',
												'notification-master'
											),
											value: 'delete',
										},
									]}
									value={selectedAction}
									onChange={(value) =>
										setSelectedAction(value)
									}
								/>
								<Button
									type="primary"
									onClick={() =>
										handleBulkAction(selectedAction)
									}
									loading={isApplying}
								>
									{__('Apply', 'notification-master')}
								</Button>
							</Flex>
							<Flex
								align="center"
								style={{ marginBottom: '1rem' }}
							>
								<Popconfirm
									title={__(
										'Are you sure?',
										'notification-master'
									)}
									onConfirm={deleteAllLogs}
									okText={__('Yes', 'notification-master')}
									cancelText={__('No', 'notification-master')}
								>
									<Button type="primary" danger>
										{__(
											'Delete All',
											'notification-master'
										)}
									</Button>
								</Popconfirm>
							</Flex>
						</Flex>
						<Table
							columns={columns}
							dataSource={logs.map((log) => ({
								...log,
								log_status: (
									<Typography.Text
										type={
											log.status === 'error'
												? 'danger'
												: 'success'
										}
									>
										{log.status}
									</Typography.Text>
								),
								notification: (
									<Typography.Text>
										{log.content.notification_name}
									</Typography.Text>
								),
								date: convertDate(log.date),
								view: (
									<Tooltip
										title={__(
											'View',
											'notification-master'
										)}
									>
										<Button
											type="primary"
											shape="circle"
											icon={<EyeOutlined />}
											onClick={() => setviewLog(log)}
										/>
									</Tooltip>
								),
							}))}
							pagination={{
								total: count,
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total) =>
									`${__('Total', 'notification-master')}: ${total}`,
								onChange: (page, pageSize) => {
									setCurrentPage(page);
									setPerPage(pageSize);
								},
							}}
							loading={isLoading}
							rowKey="id"
							style={{ width: '100%' }}
							rowSelection={{
								selectedRowKeys,
								onChange: (selectedRowKeys) =>
									setSelectedRowKeys(selectedRowKeys),
							}}
						/>
					</>
				)}
			</div>

			<Modal
				title={__('Log Details', 'notification-master')}
				open={!!viewLog}
				onCancel={() => setviewLog(null)}
				footer={null}
				width={800}
			>
				<div className="notification-master__log--view">
					<Flex gap={10}>
						<Typography.Text strong>
							{__('Name', 'notification-master')}
							{' : '}
						</Typography.Text>
						<Typography.Text>
							{viewLog?.content.notification_name}
						</Typography.Text>
					</Flex>
					<Flex gap={10} style={{ marginTop: '1rem' }}>
						<Typography.Text strong>
							{__('Trigger', 'notification-master')}
							{' : '}
						</Typography.Text>
						<Typography.Text>
							{viewLog?.content.trigger_name}{' '}
							{`"${viewLog?.content.trigger}"`}
						</Typography.Text>
					</Flex>
					<Flex gap={10} style={{ marginTop: '1rem' }}>
						<Typography.Text strong>
							{__('Integration', 'notification-master')}
							{' : '}
						</Typography.Text>
						<Typography.Text>
							{viewLog?.integration}
						</Typography.Text>
					</Flex>
					<Flex gap={10} style={{ marginTop: '1rem' }}>
						<Typography.Text strong>
							{__('Status', 'notification-master')}
							{' : '}
						</Typography.Text>
						<Typography.Text
							type={
								viewLog?.status === 'error'
									? 'danger'
									: 'success'
							}
						>
							{viewLog?.status}
						</Typography.Text>
					</Flex>
					<Flex gap={10} style={{ marginTop: '1rem' }}>
						<Typography.Text strong>
							{__('Date', 'notification-master')}
							{' : '}
						</Typography.Text>
						<Typography.Text>{viewLog?.date}</Typography.Text>
					</Flex>
					<Flex
						style={{ marginTop: '1rem', flexDirection: 'column' }}
					>
						<Typography.Text strong>
							{__('Details', 'notification-master')}
						</Typography.Text>
						<pre style={{ overflowX: 'auto' }}>
							{JSON.stringify(
								prepareContent(viewLog?.content),
								null,
								2
							)}
						</pre>
					</Flex>
				</div>
			</Modal>
		</>
	);
};

export default NotificationLog;
