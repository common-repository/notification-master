/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { Input, Typography } from 'antd';
import { map, keys, find, uniqueId, isObject } from 'lodash';
import Select from 'react-select';

/**
 * Internal dependencies
 */
import './style.scss';
import config from '@Config';
import { useNotification } from '../context';
import { ConnectionsProvider } from '@ConnectionsStore';
import Connections from '../connections';
import MergeTagsModal from './merge-tags-modal';

const NotificationForm: React.FC = () => {
	const { record, onEdit } = useNotification();
	const { title, trigger } = record;
	const triggersGroups = config.triggersGroups;
	const { toggleMergeTags } = useDispatch('notification-master/core');
	const { mergeTagsStatus } = useSelect((select) => {
		return {
			mergeTagsStatus: select('notification-master/core').getMergeTags(),
		};
	});

	const FormatOptionLabel = ({ label, value, group }) => {
		if (value === trigger) return label;
		if (!value || !group) return label;
		const $trigger = config.triggersGroups[group]['triggers'][value];

		if (!$trigger) return label;

		return (
			<div
				key={$trigger.slug}
				className="notification-master__notification-form__trigger-option"
			>
				<Typography.Text
					style={{
						marginBottom: '5px',
						fontSize: '14px',
					}}
				>
					{label}
				</Typography.Text>
				<Typography.Text type="secondary" style={{ fontSize: '12px' }}>
					{$trigger.description}
				</Typography.Text>
			</div>
		);
	};

	const triggersOptions = map(keys(triggersGroups), (key) => {
		const group = triggersGroups[key];
		const { label, triggers } = group;
		const triggersOptions = map(keys(triggers), (triggerKey) => {
			const trigger = triggers[triggerKey];

			return {
				label: trigger.name,
				value: triggerKey,
				group: key,
			};
		});

		return {
			label: label,
			options: triggersOptions,
		};
	});

	const getTriggerValue = () => {
		for (const groupKey in triggersGroups) {
			const group = triggersGroups[groupKey];
			const option = find(keys(group.triggers), (key) => key === trigger);

			if (option) {
				return {
					label: group.triggers[option].name,
					value: option,
					group: groupKey,
				};
			}
		}

		return null;
	};

	return (
		<div className="notification-master__notification-form">
			<div className="notification-master__notification-form__field">
				<Typography.Title level={5}>
					{__('Title', 'notification-master')}
				</Typography.Title>
				<Input
					value={title}
					size="large"
					onChange={(e) => {
						onEdit({
							title: e.target.value,
						});
					}}
					style={{
						padding: '7px 11px',
						fontWeight: 500,
					}}
				/>
			</div>
			<div className="notification-master__notification-form__field">
				<Typography.Title level={5}>
					{__('Trigger', 'notification-master')}
				</Typography.Title>
				<Select
					options={triggersOptions}
					value={getTriggerValue()}
					formatOptionLabel={FormatOptionLabel}
					onChange={(option) => {
						if (!option) return;
						onEdit({
							trigger: option.value,
							triggerGroup: option.group,
						});
					}}
				/>
			</div>
			<div className="notification-master__notification-form__field">
				<ConnectionsProvider
					value={{
						connections: isObject(record.connections)
							? record.connections
							: {},
						addConnection: (connection) => {
							const connections = isObject(record.connections)
								? { ...record.connections }
								: {};
							const randomString = Math.random()
								.toString(36)
								.substring(7);
							const id = uniqueId(`connection_${randomString}`);
							connections[id] = connection;

							onEdit({
								connections,
							});
						},
						updateConnection: (id, field = {}) => {
							const connections = { ...record.connections };
							const connection = connections[id];
							connections[id] = {
								...connection,
								...field,
							};

							onEdit({
								connections,
							});
						},
						getConnection: (id) => {
							const connections = { ...record.connections };
							return connections[id];
						},
						deleteConnection: (id) => {
							const connections = { ...record.connections };
							delete connections[id];

							onEdit({
								connections,
							});
						},
					}}
				>
					<Typography.Title level={5}>
						{__('Connections', 'notification-master')}
					</Typography.Title>
					<Connections />
				</ConnectionsProvider>
			</div>
			<MergeTagsModal
				isOpen={mergeTagsStatus}
				onClose={() => toggleMergeTags(false)}
			/>
		</div>
	);
};

export default NotificationForm;
