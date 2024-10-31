/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { Button, Input, Typography, Modal, Switch } from 'antd';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';

/**
 * Internal dependencies
 */
import './style.scss';
import { ProAlert } from '@Components';
import { getIntegration } from '@Integrations';
import { useConnections } from '@ConnectionsStore';
import { getPath } from '@Utils';

interface Props {
	connectionId: string;
	onClose: () => void;
}

const EditModal: React.FC<Props> = ({ connectionId, onClose }) => {
	const { getConnection, updateConnection } = useConnections();
	const connection = getConnection(connectionId);
	const [connectionEdited, setConnectionEdited] = useState(connection);
	const [modalVisible, setModalVisible] = useState(true);
	const { addNotice } = useDispatch('notification-master/core');
	const integrationData = getIntegration(connection.integration);
	const navigate = useNavigate();

	if (!integrationData.available) {
		return (
			<>
				{modalVisible && (
					<Modal
						title={false}
						open={modalVisible}
						onCancel={() => {
							setModalVisible(false);
							onClose();
						}}
						footer={null}
						zIndex={999999}
					>
						<ProAlert />
					</Modal>
				)}
			</>
		);
	}

	const Component = integrationData.component;

	const changeHandler = (key: string, value: any) => {
		setConnectionEdited((prevConnection) => ({
			...prevConnection,
			[key]: value,
		}));
	};

	const saveHandler = () => {
		if (!connectionEdited.name) {
			addNotice({
				type: 'error',
				message: __(
					'Connection name is required',
					'notification-master'
				),
			});
			return;
		}

		if (!connectionEdited.integration) {
			addNotice({
				type: 'error',
				message: __('Integration is required', 'notification-master'),
			});
			return;
		}

		if (isEmpty(connectionEdited.settings)) {
			addNotice({
				type: 'error',
				message: __('Invalid settings', 'notification-master'),
			});
			return;
		}

		updateConnection(connectionId, connectionEdited);
		onClose();
	};

	const footer = [
		<Button key="close" onClick={onClose}>
			{__('Close', 'notification-master')}
		</Button>,
		<Button type="primary" onClick={() => saveHandler()}>
			{__('Save', 'notification-master')}
		</Button>,
	];

	return (
		<Modal
			title={connectionEdited.name}
			open={true}
			onOk={() => saveHandler()}
			onCancel={onClose}
			footer={footer}
			className="notification-master__connections__edit-modal"
			width={800}
			maskClosable={false}
		>
			{!integrationData.configured && (
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
			{integrationData.configured && (
				<>
					<div className="notification-master__connections__edit-modal__field">
						<Typography.Title
							level={5}
							className="notification-master__connections__edit-modal__field__title required"
						>
							{__('Connection name', 'notification-master')}
						</Typography.Title>
						<Input
							value={connectionEdited.name}
							onChange={(e) =>
								changeHandler('name', e.target.value)
							}
						/>
					</div>
					{Component && (
						<Component
							settings={connectionEdited.settings}
							onChange={(settings) => {
								setConnectionEdited((prevConnectionEdited) => ({
									...prevConnectionEdited,
									settings: {
										...prevConnectionEdited.settings,
										...settings,
									},
								}));
							}}
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
							{__('Enable connection', 'notification-master')}
						</Typography.Title>
						<Switch
							checked={connectionEdited.enabled}
							onChange={(checked) =>
								changeHandler('enabled', checked)
							}
						/>
					</div>
				</>
			)}
		</Modal>
	);
};

export default EditModal;
