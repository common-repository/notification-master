/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEntityRecord } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import type { Notification } from '../../pages/types';

export const useNewNotification = () => {
	const defaultRecord: Notification = {
		date: '',
		date_gmt: '',
		guid: {
			rendered: '',
			raw: '',
		},
		id: 0,
		connections: {}, // You need to define the type Connections
		link: '',
		modified: '',
		modified_gmt: '',
		password: '',
		slug: '',
		status: 'draft',
		template: '',
		title: __('New Notification', 'notification-master'),
		trigger: '',
		triggerGroup: '',
		type: '',
	};

	const { saveEntityRecord } = useDispatch(coreStore);
	const [record, setRecord] = useState<Notification>(defaultRecord);
	const save = () => {
		const newRecord = {
			title: record.title,
			status: record.status,
			trigger: record.trigger,
			connections: record.connections,
		};
		if (record.id !== 0) {
			newRecord['id'] = record.id;
		}
		return saveEntityRecord('postType', 'ntfm_notification', newRecord);
	};
	const edit = (option: { [key: string]: any }) => {
		setRecord({ ...record, ...option });
	};

	// Always call useEntityRecord unconditionally
	const entityRecord = useEntityRecord(
		'postType',
		'ntfm_notification',
		record.id
	);

	// Conditionally return based on record.id
	if (record.id === 0) {
		return {
			record,
			save,
			edit,
			hasResolved: true,
			hasEdits: true,
			editedRecord: record,
		};
	} else {
		return entityRecord;
	}
};
