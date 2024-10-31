/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { Button, Switch, Typography, Popconfirm } from 'antd';

/**
 * Internal dependencies
 */
import './style.scss';
import { useNotification } from '../context';

const NotificationSidebar: React.FC = () => {
	const {
		record,
		onEdit,
		onSave,
		isSaving,
		hasEdits,
		isNew,
		onDelete,
		isDeleting,
	} = useNotification();

	return (
		<div className="notification-master__notification-sidebar">
			<div className="notification-master__notification-sidebar__header">
				<div className="notification-master__notification-sidebar__header__field">
					<Typography.Text strong>
						{__('Enabled', 'notification-master')}
					</Typography.Text>
					<Switch
						checked={record.status === 'publish'}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						onChange={(checked) =>
							onEdit({
								status: checked ? 'publish' : 'draft',
							})
						}
					/>
				</div>
			</div>
			<div className="notification-master__notification-sidebar__footer">
				{!isNew && (
					<Popconfirm
						title={__('Are you sure?', 'notification-master')}
						onConfirm={onDelete}
						okText={__('Yes', 'notification-master')}
						cancelText={__('No', 'notification-master')}
					>
						<Button type="text" danger loading={isDeleting}>
							{__('Delete', 'notification-master')}
						</Button>
					</Popconfirm>
				)}
				<Button
					type="primary"
					onClick={onSave}
					loading={isSaving}
					disabled={!isNew && !hasEdits}
					style={{
						marginLeft: isNew ? 'auto' : '0',
					}}
				>
					{isNew
						? __('Save', 'notification-master')
						: hasEdits
							? __('Update', 'notification-master')
							: __('Saved', 'notification-master')}
				</Button>
			</div>
		</div>
	);
};

export default NotificationSidebar;
