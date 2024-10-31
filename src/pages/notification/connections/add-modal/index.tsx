/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { Button, Input, Typography, Modal, Popconfirm, Switch } from 'antd';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';

/**
 * Internal dependencies
 */
import './style.scss';
import IntegrationsSelect from '../integrations-select';
import type { Connection } from '@ConnectionsStore';
import { getIntegration } from '@Integrations';
import { checkRequiredFields } from '@Utils';
import { getPath } from '@Utils';

interface Props {
	onSave: (connection: Connection) => void;
	onClose: () => void;
}

const AddModal: React.FC<Props> = ({ onSave, onClose }) => {
	const [connection, setConnection] = useState<Connection>({
		enabled: true,
		name: __('New connection', 'notification-master'),
		integration: '',
		settings: {},
	});
	const [step, setStep] = useState(1);
	const { addNotice } = useDispatch('notification-master/core');
	const integration = connection.integration
		? getIntegration(connection.integration)
		: null;
	const Component = integration ? integration.component : null;
	const navigate = useNavigate();

	const changeHandler = (key: string, value: any) => {
		setConnection({
			...connection,
			[key]: value,
		});
	};

	const saveHandler = () => {
		if (isEmpty(connection.name)) {
			addNotice({
				type: 'error',
				message: __(
					'Connection name is required',
					'notification-master'
				),
			});
			return;
		}

		if (isEmpty(connection.integration)) {
			addNotice({
				type: 'error',
				message: __('Integration is required', 'notification-master'),
			});
			return;
		}

		if (!checkRequiredFields(connection.integration, connection.settings)) {
			addNotice({
				type: 'error',
				message: __(
					'Please fill in all required fields',
					'notification-master'
				),
			});
			return;
		}

		onSave(connection);
		onClose();
	};

	const firstStepFooter = [
		<Button key="cancel" onClick={onClose}>
			{__('Cancel', 'notification-master')}
		</Button>,
		<Button
			type="primary"
			onClick={() => {
				if (connection.integration) {
					setStep(2);
				}
			}}
			disabled={!connection.integration}
		>
			{__('Next', 'notification-master')}
		</Button>,
	];

	const secondStepFooter = [
		<Popconfirm
			title={__(
				'All changes will be lost. Are you sure?',
				'notification-master'
			)}
			onConfirm={() => {
				setConnection({
					enabled: true,
					name: '',
					integration: '',
					settings: {},
				});
				setStep(1);
			}}
			okText={__('Yes', 'notification-master')}
			cancelText={__('No', 'notification-master')}
		>
			<Button
				onClick={(e) => {
					e.preventDefault();
				}}
				type="default"
			>
				{__('Back', 'notification-master')}
			</Button>
		</Popconfirm>,
		<Button type="primary" onClick={() => saveHandler()}>
			{__('Save', 'notification-master')}
		</Button>,
	];

	return (
		<Modal
			title={__('Add connection', 'notification-master')}
			open={true}
			onOk={() => saveHandler()}
			onCancel={onClose}
			footer={step === 1 ? firstStepFooter : secondStepFooter}
			className="notification-master__connections__add-modal"
			width={800}
			maskClosable={false}
		>
			{step === 1 && (
				<>
					<Typography.Title level={5}>
						{__('Select integration', 'notification-master')}
					</Typography.Title>
					<Typography.Text type="secondary">
						{__(
							"Select the integration you'd like to use to send your notifications.",
							'notification-master'
						)}
						<br />
						{__(
							'Each integration has its own settings and requirements.',
							'notification-master'
						)}
					</Typography.Text>
					<IntegrationsSelect
						value={connection.integration}
						onChange={(integration) =>
							changeHandler('integration', integration)
						}
					/>
				</>
			)}
			{step === 2 && (
				<>
					{!integration?.configured && (
						<>
							<Typography.Title level={4}>
								{__(
									'This integration is not configured yet, please configure it first.',
									'notification-master'
								)}
							</Typography.Title>
							<Button
								type="primary"
								onClick={() => {
									navigate(
										getPath(
											'settings',
											null,
											connection.integration
										)
									);
								}}
							>
								{__('Go to settings', 'notification-master')}
							</Button>
						</>
					)}
					{integration?.configured && Component && (
						<>
							<div className="notification-master__connections__add-modal__field">
								<Typography.Title
									level={5}
									className="notification-master__connections__add-modal__field__title required"
								>
									{__(
										'Connection name',
										'notification-master'
									)}
								</Typography.Title>
								<Input
									value={connection.name}
									onChange={(e) =>
										changeHandler('name', e.target.value)
									}
								/>
							</div>
							{Component && (
								<Component
									settings={connection.settings}
									onChange={(settings) =>
										setConnection((prevConnection) => ({
											...prevConnection,
											settings: {
												...prevConnection.settings,
												...settings,
											},
										}))
									}
								/>
							)}
							<div
								className="notification-master__connections__add-modal__field"
								style={{ marginTop: '20px' }}
							>
								<Typography.Title
									level={5}
									className="notification-master__connections__add-modal__field__title"
								>
									{__(
										'Enable connection',
										'notification-master'
									)}
								</Typography.Title>
								<Switch
									checked={connection.enabled}
									onChange={(checked) =>
										changeHandler('enabled', checked)
									}
								/>
							</div>
						</>
					)}
				</>
			)}
		</Modal>
	);
};

export default AddModal;
