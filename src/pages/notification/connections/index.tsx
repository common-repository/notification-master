/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
/**
 * External dependencies
 */
import { map, keys, isEmpty } from 'lodash';
import { Button, Typography, Popconfirm, Card, Switch } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import { useConnections } from '@ConnectionsStore';
import AddModal from './add-modal';
import EditModal from './edit-modal';
import { getIntegration } from '@Integrations';

const Connections: React.FC = () => {
	const { connections, addConnection, deleteConnection, updateConnection } =
		useConnections();
	const [openAddModal, setOpenAddModal] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);

	return (
		<div className="notification-master__connections">
			{isEmpty(connections) && (
				<div className="notification-master__connections__empty">
					<Typography.Text type="secondary">
						{__('No connections yet.', 'notification-master')}
					</Typography.Text>
				</div>
			)}
			{!isEmpty(connections) && (
				<div className="notification-master__connections__list">
					{map(keys(connections), (key) => {
						const connection = connections[key];
						const {
							name,
							integration,
							enabled = true,
						} = connection;
						const integrationSettings = getIntegration(integration);
						if (!integrationSettings) return null;
						const {
							icon,
							name: integrationName,
							available,
						} = integrationSettings;

						if (!available) return null;
						return (
							<div
								key={key}
								className="notification-master__connections__list__item"
							>
								<Card
									style={{ width: 200 }}
									cover={
										<div className="notification-master__connections__list__item__icon">
											<img
												alt={integrationName}
												src={icon}
											/>
										</div>
									}
									actions={[
										<Switch
											key="enabled"
											checked={enabled}
											onChange={(enabled) => {
												updateConnection(key, {
													enabled,
												});
											}}
											size="small"
										/>,
										<EditOutlined
											key="edit"
											onClick={() => setEditId(key)}
										/>,
										<Popconfirm
											title={__(
												'Are you sure?',
												'notification-master'
											)}
											onConfirm={() =>
												deleteConnection(key)
											}
											okText={__(
												'Yes',
												'notification-master'
											)}
											cancelText={__(
												'No',
												'notification-master'
											)}
										>
											<DeleteOutlined key="delete" />
										</Popconfirm>,
									]}
									classNames={{
										body: 'notification-master__connections__list__item__body',
										cover: 'notification-master__connections__list__item__cover',
									}}
								>
									<Typography.Paragraph type="secondary">
										<Typography.Text strong>
											{__('Name:', 'notification-master')}
										</Typography.Text>{' '}
										<Typography.Text>
											{name}
										</Typography.Text>
									</Typography.Paragraph>
									<Typography.Paragraph type="secondary">
										<Typography.Text strong>
											{__(
												'Integration:',
												'notification-master'
											)}
										</Typography.Text>{' '}
										<Typography.Text>
											{integrationName}
										</Typography.Text>
									</Typography.Paragraph>
								</Card>
							</div>
						);
					})}
				</div>
			)}
			<Button
				type="primary"
				onClick={() => setOpenAddModal(true)}
				className="notification-master__connections__add-button"
				size="large"
				icon={<PlusCircleOutlined />}
			>
				{__('Add connection', 'notification-master')}
			</Button>
			{openAddModal && (
				<AddModal
					onSave={(connection) => {
						setEditId(null);
						addConnection(connection);
					}}
					onClose={() => {
						setOpenAddModal(false);
						setEditId(null);
					}}
				/>
			)}
			{editId && (
				<EditModal
					connectionId={editId}
					onClose={() => setEditId(null)}
				/>
			)}
		</div>
	);
};

export default Connections;
