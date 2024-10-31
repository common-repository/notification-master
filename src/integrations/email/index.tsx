/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { Button, Flex, Input, Typography } from 'antd';
import { map } from 'lodash';
import Quill from 'quill';
import classnames from 'classnames';
import { MinusCircleOutlined } from '@ant-design/icons';
import Select from 'react-select';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../types';
import { getIntegration } from '@Integrations';
import { MergeTagsIcon } from '../components';
import config from '@Config';
import UserSelect from './user-select';

const EmailIntegration: React.FC<{
	settings: Settings;
	onChange: (setting: any) => void;
}> = ({ settings, onChange }) => {
	const { properties } = getIntegration('email');
	const {
		emails,
		excluded_emails = [],
		subject = '',
		message = '<p></p>',
	} = settings;
	const { toggleMergeTags } = useDispatch('notification-master/core');
	const roles = config.userRoles;

	useEffect(() => {
		// Check if emails is array of strings and convert to array of objects
		if (emails?.length && typeof emails[0] === 'string') {
			onChange({
				emails: map(emails, (email) => ({
					type: 'custom',
					value: email,
				})),
			});
		}
		if (!settings?.emails) {
			onChange({
				emails: [
					{
						type: 'custom',
						value: '{{general.admin_email}}',
					},
				],
			});
		}
	}, []);

	const changeHandler = (key: string, value: any) => {
		onChange({
			[key]: value,
		});
	};

	const emailTypeOptions = [
		{
			label: __('Select Type', 'notification-master'),
			value: '',
			style: { display: 'none' },
		},
		{
			label: __('Role', 'notification-master'),
			value: 'role',
		},
		{
			label: __('User', 'notification-master'),
			value: 'user',
		},
		{
			label: __('Custom', 'notification-master'),
			value: 'custom',
		},
	];

	const rolesOptions = map(roles, (role, key) => ({
		label: role.label,
		value: key,
	}));

	const getTypeValue = (type: string) => {
		const option = emailTypeOptions.find((option) => option.value === type);

		return option || emailTypeOptions[0];
	};

	useEffect(() => {
		const quill = new Quill('#quill-container', {
			theme: 'snow',
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike', 'link'], // toggled buttons
					['blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['task-list'],
					[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
					[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
					[{ direction: 'rtl' }], // text direction
					[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					[{ color: [] }, { background: [] }], // dropdown with defaults from theme
					[{ font: [] }],
					[{ align: [] }],
					['clean'],
				],
			},
			placeholder: __(
				'Write your message here...',
				'notification-master'
			),
		});
		quill.on('text-change', () => {
			changeHandler('message', quill.root.innerHTML);
		});
	}, []);

	return (
		<Flex vertical gap={10}>
			<Typography.Title level={5} className="ntfm-custom-title">
				{__('Email Settings', 'notification-master')}
			</Typography.Title>
			<div className="notification-master__integration--settings">
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.emails.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Email Addresses', 'notification-master')}
					</Typography.Title>
					<Typography.Text
						type="secondary"
						style={{ fontSize: '12px' }}
						className="notification-master__integration--settings__field__description"
					>
						{__(
							'You can use merge tags. For example, you can use {{general.admin_email}} to send the email to the admin email address.',
							'notification-master'
						)}
					</Typography.Text>
					<div className="notification-master__integration--settings__field__list">
						{map(emails, (email, index) => (
							<div
								key={index}
								className="notification-master__integration--settings__field__list__item"
							>
								<Select
									placeholder={__(
										'Select Type',
										'notification-master'
									)}
									value={getTypeValue(email.type)}
									onChange={(value) =>
										changeHandler('emails', [
											...emails.slice(0, index),
											{
												...email,
												type: value?.value || '',
												value: '',
											},
											...emails.slice(index + 1),
										])
									}
									isSearchable={false}
									options={emailTypeOptions}
									className="notification-master__integration--settings__field__list__item__input notification-master-input-custom"
									styles={{
										control: (provided) => ({
											...provided,
											minHeight: '35px',
											height: '35px',
										}),
										valueContainer: (provided) => ({
											...provided,
											height: '35px',
											padding: '0 6px',
										}),

										input: (provided) => ({
											...provided,
											margin: '0px',
										}),
										indicatorSeparator: () => ({
											display: 'none',
										}),
										indicatorsContainer: (provided) => ({
											...provided,
											height: '35px',
										}),
									}}
								/>
								{email.type === 'role' && (
									<Select
										placeholder={__(
											'Select Role',
											'notification-master'
										)}
										value={email.value}
										onChange={(value) =>
											changeHandler('emails', [
												...emails.slice(0, index),
												{
													...email,
													value,
												},
												...emails.slice(index + 1),
											])
										}
										isSearchable={false}
										options={rolesOptions}
										className="notification-master__integration--settings__field__list__item__input notification-master-input-custom"
										styles={{
											control: (provided) => ({
												...provided,
												minHeight: '35px',
												height: '35px',
											}),
											valueContainer: (provided) => ({
												...provided,
												height: '35px',
												padding: '0 6px',
											}),

											input: (provided) => ({
												...provided,
												margin: '0px',
											}),
											indicatorSeparator: () => ({
												display: 'none',
											}),
											indicatorsContainer: (
												provided
											) => ({
												...provided,
												height: '35px',
											}),
										}}
									/>
								)}
								{email.type === 'user' && (
									<UserSelect
										value={email.value}
										onChange={(value) =>
											changeHandler('emails', [
												...emails.slice(0, index),
												{
													...email,
													value,
												},
												...emails.slice(index + 1),
											])
										}
									/>
								)}
								{email.type === 'custom' && (
									<Input
										placeholder={__(
											'example@domain.com or {{general.admin_email}}',
											'notification-master'
										)}
										value={email.value}
										onChange={(e) =>
											changeHandler('emails', [
												...emails.slice(0, index),
												{
													...email,
													value: e.target.value,
												},
												...emails.slice(index + 1),
											])
										}
										addonAfter={<MergeTagsIcon />}
										className="notification-master__integration--settings__field__list__item__input"
									/>
								)}
								<Button
									danger
									type="link"
									onClick={() =>
										changeHandler(
											'emails',
											// @ts-ignore
											emails.filter((e, i) => i !== index)
										)
									}
									icon={<MinusCircleOutlined />}
								/>
							</div>
						))}
						<Button
							onClick={() =>
								changeHandler('emails', [
									...emails,
									{
										type: 'custom',
										value: '',
									},
								])
							}
						>
							{__('Add Email', 'notification-master')}
						</Button>
					</div>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.excluded_emails.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Exclude Email Addresses', 'notification-master')}
					</Typography.Title>
					<Typography.Text
						type="secondary"
						style={{ fontSize: '12px' }}
						className="notification-master__integration--settings__field__description"
					>
						{__(
							'You can use merge tags. For example, you can use {{general.admin_email}} to exclude the admin email address.',
							'notification-master'
						)}
					</Typography.Text>
					<div className="notification-master__integration--settings__field__list">
						{map(excluded_emails, (email, index) => (
							<div
								key={index}
								className="notification-master__integration--settings__field__list__item"
							>
								<Select
									placeholder={__(
										'Select Type',
										'notification-master'
									)}
									value={getTypeValue(email.type)}
									onChange={(value) =>
										changeHandler('excluded_emails', [
											...excluded_emails.slice(0, index),
											{
												...email,
												type: value?.value || '',
												value: '',
											},
											...excluded_emails.slice(index + 1),
										])
									}
									options={emailTypeOptions}
									className="notification-master__integration--settings__field__list__item__input notification-master-input-custom"
									styles={{
										control: (provided) => ({
											...provided,
											minHeight: '35px',
											height: '35px',
										}),
										valueContainer: (provided) => ({
											...provided,
											height: '35px',
											padding: '0 6px',
										}),

										input: (provided) => ({
											...provided,
											margin: '0px',
										}),
										indicatorSeparator: () => ({
											display: 'none',
										}),
										indicatorsContainer: (provided) => ({
											...provided,
											height: '35px',
										}),
									}}
								/>
								{email.type === 'role' && (
									<Select
										placeholder={__(
											'Select Role',
											'notification-master'
										)}
										value={email.value}
										onChange={(value) =>
											changeHandler('excluded_emails', [
												...excluded_emails.slice(
													0,
													index
												),
												{
													...email,
													value,
												},
												...excluded_emails.slice(
													index + 1
												),
											])
										}
										options={rolesOptions}
										className="notification-master__integration--settings__field__list__item__input"
										styles={{
											control: (provided) => ({
												...provided,
												minHeight: '20px',
											}),
										}}
									/>
								)}
								{email.type === 'user' && (
									<UserSelect
										value={email.value}
										onChange={(value) =>
											changeHandler('excluded_emails', [
												...excluded_emails.slice(
													0,
													index
												),
												{
													...email,
													value,
												},
												...excluded_emails.slice(
													index + 1
												),
											])
										}
									/>
								)}
								{email.type === 'custom' && (
									<Input
										placeholder={__(
											'example@domain.com or {{general.admin_email}}',
											'notification-master'
										)}
										value={email.value}
										onChange={(e) =>
											changeHandler('excluded_emails', [
												...excluded_emails.slice(
													0,
													index
												),
												{
													...email,
													value: e.target.value,
												},
												...excluded_emails.slice(
													index + 1
												),
											])
										}
										addonAfter={<MergeTagsIcon />}
										className="notification-master__integration--settings__field__list__item__input"
									/>
								)}
								<Button
									danger
									type="link"
									onClick={() =>
										changeHandler(
											'excluded_emails',
											excluded_emails.filter(
												// @ts-ignore
												(e, i) => i !== index
											)
										)
									}
									icon={<MinusCircleOutlined />}
								/>
							</div>
						))}
						<Button
							onClick={() =>
								changeHandler('excluded_emails', [
									...excluded_emails,
									{
										type: 'custom',
										value: '',
									},
								])
							}
						>
							{__('Add Email', 'notification-master')}
						</Button>
					</div>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.subject.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Subject', 'notification-master')}
					</Typography.Title>
					<Input
						value={subject}
						onChange={(e) =>
							changeHandler('subject', e.target.value)
						}
						addonAfter={<MergeTagsIcon />}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.message.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Message', 'notification-master')}
					</Typography.Title>
					<div className="notification-master__integration--settings__field__input">
						<Button
							onClick={() => toggleMergeTags(true)}
							style={{ margin: '10px 0' }}
							className="notification-master__integration--settings__field__input__button"
						>
							{__('Merge Tags', 'notification-master')}
						</Button>
						<div id="quill-container">
							<div
								dangerouslySetInnerHTML={{ __html: message }}
							></div>
						</div>
					</div>
				</div>
			</div>
		</Flex>
	);
};

addFilter(
	'NotificationMaster.Integration',
	'NotificationMaster.EmailIntegration',
	(integration, slug) => {
		if (slug === 'email') {
			return {
				...integration,
				component: EmailIntegration,
				available: true,
			};
		}

		return integration;
	}
);
