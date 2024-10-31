/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { Button, Input, Typography, Switch, Flex } from 'antd';
import { MinusCircleOutlined, DragOutlined } from '@ant-design/icons';
import { map } from 'lodash';
import classnames from 'classnames';
import { ReactSortable } from 'react-sortablejs';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../types';
import { getIntegration } from '@Integrations';
import { MergeTagsIcon } from '../components';
import config from '@Config';

const DiscordIntegration: React.FC<{
	settings: Settings;
	onChange: (setting: any) => void;
}> = ({ settings, onChange }) => {
	const {
		url = '',
		message = {
			title: '',
			title_link: '',
			description: '',
			content: '',
			author: {
				name: '',
				url: '',
				icon_url: '',
			},
			fields: [
				{
					name: '',
					value: '',
					inline: true,
				},
			],
		},
	} = settings;
	const { properties } = getIntegration('discord');
	const { toggleMergeTags } = useDispatch('notification-master/core');
	const { ntfmSiteUrl } = config;

	const changeHandler = (key: string, value: any) => {
		onChange({
			[key]: value,
		});
	};

	const changeFieldHandler = (key: string, value: any) => {
		onChange({
			message: {
				...message,
				[key]: value,
			},
		});
	};

	const handleChangeField = (index: any, key: string, value: any) => {
		const newFields = [...message.fields];
		newFields[index] = {
			...newFields[index],
			[key]: value,
		};
		changeFieldHandler('fields', newFields);
	};

	return (
		<Flex vertical gap={10}>
			<Typography.Title level={5} className="ntfm-custom-title">
				{__('Discord Settings', 'notification-master')}
			</Typography.Title>
			<Typography.Text type="secondary">
				{__(
					'Read the documentation to learn more about how to setup Discord Webhook.',
					'notification-master'
				)}{' '}
				<a href={`${ntfmSiteUrl}/docs/discord/`} target="_blank">
					{__('Find out more', 'notification-master')}
				</a>
			</Typography.Text>
			<div className="notification-master__integration--settings">
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.url.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('URL', 'notification-master')}
					</Typography.Title>
					<Input
						value={url}
						onChange={(e) => changeHandler('url', e.target.value)}
						placeholder="https://example.com/webhook"
					/>
				</div>
				<div
					style={{
						width: '100%',
					}}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title required"
					>
						{__('Message', 'notification-master')}
					</Typography.Title>
					<div
						style={{
							padding: '10px 20px',
						}}
					>
						<div className="notification-master__integration--settings__field">
							<Typography.Title
								level={5}
								className="notification-master__integration--settings__field__title"
							>
								{__('Title', 'notification-master')}
							</Typography.Title>
							<Input
								value={message.title}
								onChange={(e) =>
									changeFieldHandler('title', e.target.value)
								}
								placeholder={__('Title', 'notification-master')}
								addonAfter={<MergeTagsIcon />}
							/>
						</div>
						<div className="notification-master__integration--settings__field">
							<Typography.Title
								level={5}
								className="notification-master__integration--settings__field__title"
							>
								{__('Title Link', 'notification-master')}
							</Typography.Title>
							<Input
								value={message.title_link}
								onChange={(e) =>
									changeFieldHandler(
										'title_link',
										e.target.value
									)
								}
								placeholder={__(
									'Title Link',
									'notification-master'
								)}
								addonAfter={<MergeTagsIcon />}
							/>
						</div>
						<div className="notification-master__integration--settings__field">
							<Typography.Title
								level={5}
								className="notification-master__integration--settings__field__title"
							>
								{__('Description', 'notification-master')}
							</Typography.Title>
							<Input
								value={message.description}
								onChange={(e) =>
									changeFieldHandler(
										'description',
										e.target.value
									)
								}
								placeholder={__(
									'Description',
									'notification-master'
								)}
								addonAfter={<MergeTagsIcon />}
							/>
						</div>
						<div className="notification-master__integration--settings__field">
							<Typography.Title
								level={5}
								className="notification-master__integration--settings__field__title"
							>
								{__('Content', 'notification-master')}
							</Typography.Title>
							<Typography.Text
								type="secondary"
								style={{ fontSize: '12px' }}
							>
								{__(
									'This will be the main content of the message.',
									'notification-master'
								)}
							</Typography.Text>
							<Input
								value={message.content}
								onChange={(e) =>
									changeFieldHandler(
										'content',
										e.target.value
									)
								}
								placeholder={__(
									'Content',
									'notification-master'
								)}
								addonAfter={<MergeTagsIcon />}
							/>
						</div>
						<div className="notification-master__integration--settings__field">
							<Typography.Title
								level={5}
								className="notification-master__integration--settings__field__title"
							>
								{__('Author', 'notification-master')}
							</Typography.Title>
							<div className="notification-master__integration--settings__field__list">
								<div
									className="notification-master__integration--settings__field__list__item"
									style={{
										flexDirection: 'column',
										alignItems: 'flex-start',
										gap: '5px',
									}}
								>
									<Button
										onClick={() => toggleMergeTags(true)}
									>
										{__(
											'Merge Tags',
											'notification-master'
										)}
									</Button>
									<Typography.Text
										type="secondary"
										style={{ fontSize: '12px' }}
									>
										{__(
											'Allows you to add dynamic content to the author.',
											'notification-master'
										)}
									</Typography.Text>
								</div>
								<div className="notification-master__integration--settings__field__list__item">
									<Input
										value={message.author.name}
										onChange={(e) =>
											changeFieldHandler('author', {
												...message.author,
												name: e.target.value,
											})
										}
										placeholder={__(
											'Name',
											'notification-master'
										)}
									/>
									<Input
										value={message.author.url}
										onChange={(e) =>
											changeFieldHandler('author', {
												...message.author,
												url: e.target.value,
											})
										}
										placeholder={__(
											'URL',
											'notification-master'
										)}
									/>
									<Input
										value={message.author.icon_url}
										onChange={(e) =>
											changeFieldHandler('author', {
												...message.author,
												icon_url: e.target.value,
											})
										}
										placeholder={__(
											'Icon URL',
											'notification-master'
										)}
									/>
								</div>
							</div>
							<div className="notification-master__integration--settings__field">
								<Typography.Title
									level={5}
									className="notification-master__integration--settings__field__title"
								>
									{__('Fields', 'notification-master')}
								</Typography.Title>
								<div className="notification-master__integration--settings__field__list">
									<Button
										onClick={() => toggleMergeTags(true)}
										style={{
											marginBottom: '10px',
											alignSelf: 'flex-end',
										}}
									>
										{__(
											'Merge Tags',
											'notification-master'
										)}
									</Button>
									<ReactSortable
										list={message.fields}
										setList={(fields) =>
											changeFieldHandler('fields', fields)
										}
										animation={200}
									>
										{map(message.fields, (field, index) => (
											<div
												key={index}
												className="notification-master__integration--settings__field__list__item"
												style={{
													backgroundColor: '#fff',
													padding: '10px',
													borderRadius: '5px',
													marginBottom: '10px',
												}}
											>
												<DragOutlined />
												<Input
													value={field.name}
													onChange={(e) =>
														handleChangeField(
															index,
															'name',
															e.target.value
														)
													}
													placeholder={__(
														'Label',
														'notification-master'
													)}
													className="notification-master__integration--settings__field__list__item__input"
												/>
												<Input
													value={field.value}
													onChange={(e) =>
														handleChangeField(
															index,
															'value',
															e.target.value
														)
													}
													placeholder={__(
														'Value',
														'notification-master'
													)}
													className="notification-master__integration--settings__field__list__item__input"
												/>
												<Flex
													gap={5}
													className="notification-master__integration--settings__field__list__item__input"
												>
													<Switch
														checked={field.inline}
														onChange={(checked) =>
															handleChangeField(
																index,
																'inline',
																checked
															)
														}
													/>
													<Typography.Text>
														{__(
															'Inline',
															'notification-master'
														)}
													</Typography.Text>
												</Flex>
												<Button
													onClick={() =>
														changeFieldHandler(
															'fields',
															[
																...message.fields.filter(
																	(_, i) =>
																		i !==
																		index
																),
															]
														)
													}
													danger
													type="link"
													icon={
														<MinusCircleOutlined />
													}
												/>
											</div>
										))}
									</ReactSortable>
									<Button
										onClick={() =>
											changeFieldHandler('fields', [
												...message.fields,
												{
													type: 'text',
													value: '',
													inline: true,
												},
											])
										}
										block
										type="dashed"
										size="large"
									>
										{__('Add Field', 'notification-master')}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Flex>
	);
};

addFilter(
	'NotificationMaster.Integration',
	'NotificationMaster.DiscordIntegration',
	(integration, slug) => {
		if (slug === 'discord') {
			return {
				...integration,
				component: DiscordIntegration,
				available: true,
			};
		}

		return integration;
	}
);
