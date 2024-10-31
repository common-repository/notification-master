/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * External dependencies
 */
import { Button, Input, Typography, Select, Switch, Flex } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { map } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../types';
import { getIntegration } from '@Integrations';
import { MergeTagsIcon } from '../components';
import config from '@Config';

const WebhookIntegration: React.FC<{
	settings: Settings;
	onChange: (setting: any) => void;
}> = ({ settings, onChange }) => {
	const {
		url = '',
		headers = [{}],
		body = [{}],
		show_empty_fields = false,
		method = null,
		body_format = null,
	} = settings;
	const { properties } = getIntegration('webhook');
	const { ntfmSiteUrl } = config;

	const changeHandler = (key: string, value: any) => {
		onChange({
			[key]: value,
		});
	};

	return (
		<Flex vertical gap={10}>
			<Typography.Title level={5} className="ntfm-custom-title">
				{__('Webhook Settings', 'notification-master')}
			</Typography.Title>
			<Typography.Text type="secondary">
				{__(
					'Read the documentation to learn more about how to setup webhooks.',
					'notification-master'
				)}{' '}
				<a href={`${ntfmSiteUrl}/docs/webhook/`} target="_blank">
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
					<Typography.Text
						type="secondary"
						style={{ fontSize: '12px' }}
						className="notification-master__integration--settings__field__description"
					>
						{__('You can use any URL Merge Tags.')}
					</Typography.Text>
					<Input
						value={url}
						onChange={(e) => changeHandler('url', e.target.value)}
						addonAfter={<MergeTagsIcon />}
						placeholder="https://example.com/webhook"
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.method.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Method', 'notification-master')}
					</Typography.Title>
					<Select
						value={method}
						onChange={(value) => changeHandler('method', value)}
						placeholder={'Select Method'}
						options={[
							{ label: 'GET', value: 'GET' },
							{ label: 'POST', value: 'POST' },
							{ label: 'PUT', value: 'PUT' },
							{ label: 'PATCH', value: 'PATCH' },
							{ label: 'DELETE', value: 'DELETE' },
						]}
						style={{
							width: '100%',
						}}
					/>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.headers.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Headers', 'notification-master')}
					</Typography.Title>
					<div className="notification-master__integration--settings__field__list">
						{map(headers, (header, index) => (
							<div
								key={index}
								className="notification-master__integration--settings__field__list__item"
							>
								<Input
									value={header.key}
									onChange={(e) =>
										changeHandler(
											'headers',
											headers.map((h, i) =>
												i === index
													? {
															...h,
															key: e.target.value,
														}
													: h
											)
										)
									}
									placeholder={__(
										'Key',
										'notification-master'
									)}
									className="notification-master__integration--settings__field__list__item__input"
									addonAfter={<MergeTagsIcon />}
								/>
								<Input
									value={header.value}
									onChange={(e) =>
										changeHandler(
											'headers',
											headers.map((h, i) =>
												i === index
													? {
															...h,
															value: e.target
																.value,
														}
													: h
											)
										)
									}
									placeholder={__(
										'Value',
										'notification-master'
									)}
									className="notification-master__integration--settings__field__list__item__input"
									addonAfter={<MergeTagsIcon />}
								/>
								<Button
									type="link"
									danger
									icon={<MinusCircleOutlined />}
									onClick={() =>
										changeHandler(
											'headers',
											headers.filter(
												(_, i) => i !== index
											)
										)
									}
								/>
							</div>
						))}
						<Button
							onClick={() =>
								changeHandler('headers', [
									...headers,
									{ key: '', value: '' },
								])
							}
							block
							type="dashed"
							size="large"
						>
							{__('Add Header', 'notification-master')}
						</Button>
					</div>
				</div>
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.body.required,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Body', 'notification-master')}
					</Typography.Title>
					<div className="notification-master__integration--settings__field__list">
						{map(body, (field, index) => (
							<div
								key={index}
								className="notification-master__integration--settings__field__list__item"
							>
								<Input
									value={field.key}
									onChange={(e) =>
										changeHandler(
											'body',
											body.map((f, i) =>
												i === index
													? {
															...f,
															key: e.target.value,
														}
													: f
											)
										)
									}
									placeholder={__(
										'Key',
										'notification-master'
									)}
									className="notification-master__integration--settings__field__list__item__input"
									addonAfter={<MergeTagsIcon />}
								/>
								<Input
									value={field.value}
									onChange={(e) =>
										changeHandler(
											'body',
											body.map((f, i) =>
												i === index
													? {
															...f,
															value: e.target
																.value,
														}
													: f
											)
										)
									}
									placeholder={__(
										'Value',
										'notification-master'
									)}
									className="notification-master__integration--settings__field__list__item__input"
									addonAfter={<MergeTagsIcon />}
								/>
								<Button
									type="link"
									danger
									icon={<MinusCircleOutlined />}
									onClick={() =>
										changeHandler(
											'body',
											body.filter((_, i) => i !== index)
										)
									}
								/>
							</div>
						))}
						<Button
							onClick={() =>
								changeHandler('body', [
									...body,
									{ key: '', value: '' },
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
				{['POST', 'PUT', 'PATCH'].includes(method) && (
					<div
						className={classnames(
							'notification-master__integration--settings__field',
							{
								required: properties.body_format.required,
							}
						)}
					>
						<Typography.Title
							level={5}
							className="notification-master__integration--settings__field__title"
						>
							{__('Format', 'notification-master')}
						</Typography.Title>
						<Select
							value={body_format}
							onChange={(value) =>
								changeHandler('body_format', value)
							}
							placeholder={__(
								'Select Format',
								'notification-master'
							)}
							options={[
								{ label: 'JSON', value: 'json' },
								{ label: 'Form Data', value: 'form-data' },
							]}
							style={{
								width: '100%',
							}}
						/>
					</div>
				)}
				<div
					className={classnames(
						'notification-master__integration--settings__field',
						{
							required: properties.show_empty_fields.required,
							inline: true,
						}
					)}
				>
					<Typography.Title
						level={5}
						className="notification-master__integration--settings__field__title"
					>
						{__('Show Empty Fields', 'notification-master')}
					</Typography.Title>
					<Switch
						checked={show_empty_fields}
						onChange={(value) =>
							changeHandler('show_empty_fields', value)
						}
					/>
				</div>
			</div>
		</Flex>
	);
};

addFilter(
	'NotificationMaster.Integration',
	'NotificationMaster.WebhookIntegration',
	(integration, slug) => {
		if (slug === 'webhook') {
			return {
				...integration,
				component: WebhookIntegration,
				available: true,
			};
		}

		return integration;
	}
);
