/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEntityRecord } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { useParams, useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { Button } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import { getPath } from '@Utils';
import NotificationForm from './form';
import NotificationSidebar from './sidebar';
import { NotificationProvider } from './context';
import type { Notification } from '../types';
import { useNewNotification, usePrompt } from '@Hooks';
import { usePageTitle } from '@Hooks';

const Notification: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [isNew, setIsNew] = useState(id === 'new');
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigate = useNavigate();
	const { addNotice } = useDispatch('notification-master/core');
	const { deleteEntityRecord } = useDispatch('core');

	usePageTitle(
		isNew
			? __('New Notification', 'notification-master')
			: __('Edit Notification', 'notification-master')
	);

	if (!id) {
		return null;
	}

	// Fetch the record
	const {
		editedRecord: record,
		hasResolved,
		hasEdits,
		save,
		edit,
	} = id === 'new'
		? useNewNotification()
		: useEntityRecord('postType', 'ntfm_notification', id);

	usePrompt(
		__('Are you sure you want to leave this page?', 'notification-master'),
		isNew || isSaving || isDeleting || (!isNew && hasEdits)
	);

	// If the record is still loading, return a loading spinner
	if (!hasResolved) {
		return (
			<div className="notification-master__notification--loading">
				<BeatLoader color="var(--notification-master-color-primary)" />
			</div>
		);
	}

	const saveHandler = async () => {
		if (isSaving) {
			return;
		}
		setIsSaving(true);
		try {
			const res = await save();

			// @ts-ignore - TS doesn't know about the return value of save function.
			if (res) {
				addNotice({
					type: 'success',
					message: __(
						'Notification saved successfully',
						'notification-master'
					),
				});
				if (id === 'new') {
					window.history.replaceState(
						null,
						'',
						getPath('notifications', res.id)
					);
					setIsNew(false);
					// Set the title of the notification to the title of the post.
					res.title = res?.title?.rendered;
					edit(res);
				}
			} else {
				addNotice({
					type: 'error',
					message: __(
						'Failed to save notification',
						'notification-master'
					),
				});
			}
		} catch (error: any) {
			addNotice({
				type: 'error',
				message:
					error?.data?.params?.connections ||
					__('Failed to save notification', 'notification-master'),
			});
		}
		setIsSaving(false);
	};

	const deleteHandler = async () => {
		if (isDeleting) {
			return;
		}
		setIsDeleting(true);
		try {
			const res = await deleteEntityRecord(
				'postType',
				'ntfm_notification',
				id
			);
			if (res) {
				addNotice({
					type: 'success',
					message: __(
						'Notification deleted successfully',
						'notification-master'
					),
				});
				navigate(getPath('notifications'));
			} else {
				addNotice({
					type: 'error',
					message: __(
						'Failed to delete notification',
						'notification-master'
					),
				});
			}
		} catch (error: any) {
			addNotice({
				type: 'error',
				message: __(
					'Failed to delete notification',
					'notification-master'
				),
			});
		}
		setIsDeleting(false);
	};

	return (
		<NotificationProvider
			value={{
				record: record as Notification,
				onEdit: edit,
				onSave: saveHandler,
				isSaving,
				isNew,
				hasEdits,
				onDelete: deleteHandler,
				isDeleting,
			}}
		>
			<div className="notification-master__notification">
				<div className="notification-master__notification--header">
					<Button
						type="text"
						onClick={() => {
							navigate(getPath('notifications'));
						}}
						icon={<CaretLeftOutlined />}
						size="large"
					>
						{__('Back to Notifications', 'notification-master')}
					</Button>
					<h2 className="notification-master-heading">
						{isNew ? 'New Notification' : 'Edit Notification'}
					</h2>
				</div>
				<div className="notification-master__notification--content">
					<NotificationForm />
					<NotificationSidebar />
				</div>
			</div>
		</NotificationProvider>
	);
};

export default Notification;
