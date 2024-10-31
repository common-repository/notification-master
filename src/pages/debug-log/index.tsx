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
import { isArray, isEmpty, set } from 'lodash';
import type { TableProps } from 'antd';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Log } from '../types';
import { usePageTitle } from '@Hooks';
import { convertDate } from '@Utils';

type ColumnsType<T> = TableProps<T>['columns'];

const columns: ColumnsType<Log> = [
	{
		title: __('ID', 'notification-master'),
		dataIndex: 'id',
		key: 'id',
		width: '10%',
	},
	{
		title: __('Action', 'notification-master'),
		dataIndex: 'action',
		key: 'action',
		width: '20%',
	},
	{
		title: __('Type', 'notification-master'),
		dataIndex: 'log_type',
		key: 'log_type',
		width: '20%',
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
		width: '30%',
	},
];
const DebugLog: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [logs, setLogs] = useState<Log[]>([]);
	const [perPage, setPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [viewId, setViewId] = useState<number | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [count, setCount] = useState(0);
	const [isExporting, setIsExporting] = useState(false);
	const { addNotice } = useDispatch('notification-master/core');
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedAction, setSelectedAction] = useState('');
	const [isApplying, setIsApplying] = useState(false);

	usePageTitle(__('Debug Log', 'notification-master'));

	const fetchLogs = async () => {
		try {
			const response = (await apiFetch({
				path: addQueryArgs('/ntfm/v1/logs', {
					per_page: perPage,
					page: currentPage,
				}),
			})) as any;

			if (response) {
				setLogs(isArray(response?.logs) ? response.logs : []);
				setCount(response?.count || 0);
			} else {
				addNotice({
					type: 'error',
					message: __('An error occurred', 'notification-master'),
				});
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
				path: '/ntfm/v1/logs',
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
					path: addQueryArgs('/ntfm/v1/logs'),
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

	const exportLogs = async () => {
		if (isExporting) {
			return;
		}
		setIsExporting(true);
		const response = (await apiFetch({
			path: '/ntfm/v1/logs/export',
			method: 'GET',
			parse: false,
		})) as Response;

		if (response) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'logs.json';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		}

		setIsExporting(false);
	};

	if (isLoading) {
		return (
			<div className="notification-master__log--loading">
				<BeatLoader color="var(--notification-master-color-primary)" />
			</div>
		);
	}

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

			// Check if the value is json string convert it to object
			if (typeof content[key] === 'string') {
				try {
					set(newContent, key, JSON.parse(content[key]));
				} catch (error) {
					set(newContent, key, content[key]);
				}
			} else {
				set(newContent, key, content[key]);
			}
		}

		return JSON.stringify(newContent, null, 2);
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
				{__('Debug Log', 'notification-master')}
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
								<Button
									type="primary"
									onClick={exportLogs}
									style={{ marginRight: '1rem' }}
									loading={isExporting}
								>
									{__('Export All', 'notification-master')}
								</Button>
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
								log_type: (
									<Typography.Text
										type={
											log.type === 'error'
												? 'danger'
												: log.type === 'debug'
													? 'warning'
													: 'secondary'
										}
									>
										{log.type.toUpperCase()}
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
											onClick={() => setViewId(log.id)}
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
				open={!!viewId}
				onCancel={() => setViewId(null)}
				footer={null}
				width={600}
			>
				<pre style={{ maxHeight: '400px', overflowX: 'auto' }}>
					{prepareContent(
						logs.find((log) => log.id === viewId)?.content
					)}
				</pre>
			</Modal>
		</>
	);
};

export default DebugLog;
