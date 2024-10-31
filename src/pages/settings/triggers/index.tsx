/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { Switch, Typography, Select, Badge } from 'antd';
import type { SelectProps } from 'antd';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import config from '@Config';

const Triggers: React.FC = () => {
	const { settings } = useSelect((select) => {
		const { hasFinishedResolution, getSettings } = select(
			'notification-master/core'
		);
		const settings = getSettings();
		return {
			isResolving: !hasFinishedResolution('getSettings'),
			settings,
		};
	}, []);
	const { updateSetting, toggleProAlert } = useDispatch(
		'notification-master/core'
	);

	const postTypes = config.postTypes;
	const postTypeOptions: SelectProps['options'] = postTypes;
	const taxonomies = config.taxonomies;
	const taxonomyOptions: SelectProps['options'] = taxonomies;
	const commentTypes = config.commentTypes;
	const commentTypeOptions: SelectProps['options'] = commentTypes;

	return (
		<>
			{!config.isPro && (
				<Badge.Ribbon text={__('Pro', 'notification-master')}>
					<div
						className={classnames(
							'notification-master__settings--item'
						)}
						onClick={() => toggleProAlert(true)}
					>
						<div className="notification-master__settings--item--title">
							<Typography.Title level={5}>
								{__('WooCommerce', 'notification-master')}
							</Typography.Title>
							<Typography.Text>
								{__(
									'If enabled, will be able to add notifications when the WooCommerce product, review, or order changes.',
									'notification-master'
								)}
							</Typography.Text>
						</div>
						<div className="notification-master__settings--item--switch">
							<Switch
								title={__('Enable', 'notification-master')}
								checkedChildren={__(
									'On',
									'notification-master'
								)}
								unCheckedChildren={__(
									'Off',
									'notification-master'
								)}
								checked={false}
								onChange={() => {
									toggleProAlert(true);
								}}
							/>
						</div>
					</div>
				</Badge.Ribbon>
			)}
			{config.isPro && (
				<div
					className={classnames(
						'notification-master__settings--item'
					)}
				>
					<div className="notification-master__settings--item--title">
						<Typography.Title level={5}>
							{__('WooCommerce', 'notification-master')}
						</Typography.Title>
						<Typography.Text>
							{__(
								'If enabled, will be able to add notifications when the WooCommerce product, review, or order changes.',
								'notification-master'
							)}
						</Typography.Text>
					</div>
					<div className="notification-master__settings--item--switch">
						<Switch
							title={__('Enable', 'notification-master')}
							checkedChildren={__('On', 'notification-master')}
							unCheckedChildren={__('Off', 'notification-master')}
							checked={
								settings.woocommerce_change_trigger || true
							}
							onChange={(checked) => {
								updateSetting(
									'woocommerce_change_trigger',
									checked
								);
							}}
						/>
					</div>
				</div>
			)}
			<div
				className={classnames('notification-master__settings--item', {
					'notification-master__settings--item--has-subitem':
						settings.post_status_change_trigger,
				})}
			>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Post status change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the post status changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.post_status_change_trigger}
						onChange={(checked) => {
							updateSetting(
								'post_status_change_trigger',
								checked
							);
						}}
					/>
				</div>
			</div>
			{settings.post_status_change_trigger && (
				<div className="notification-master__settings--item notification-master__settings--item--block">
					<div className="notification-master__settings--item--title">
						<Typography.Title level={5}>
							{__('Post types', 'notification-master')}
						</Typography.Title>
						<Typography.Text>
							{__(
								'Select the post types for which you want to send notifications when the post status changes.',
								'notification-master'
							)}
						</Typography.Text>
					</div>
					<div className="notification-master__settings--item--select">
						<Select
							mode="multiple"
							size="large"
							placeholder={__(
								'Select post types',
								'notification-master'
							)}
							options={postTypeOptions}
							value={settings.post_types}
							onChange={(value) => {
								updateSetting('post_types', value);
							}}
							style={{ width: '100%' }}
						/>
					</div>
				</div>
			)}
			<div
				className={classnames('notification-master__settings--item', {
					'notification-master__settings--item--has-subitem':
						settings.taxonomy_term_change_trigger,
				})}
			>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Taxonomy term change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the taxonomy term changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.taxonomy_term_change_trigger}
						onChange={(checked) => {
							updateSetting(
								'taxonomy_term_change_trigger',
								checked
							);
						}}
					/>
				</div>
			</div>
			{settings.taxonomy_term_change_trigger && (
				<div className="notification-master__settings--item notification-master__settings--item--block">
					<div className="notification-master__settings--item--title">
						<Typography.Title level={5}>
							{__('Taxonomies', 'notification-master')}
						</Typography.Title>
						<Typography.Text>
							{__(
								'Select the taxonomies for which you want to send notifications when the taxonomy term changes.',
								'notification-master'
							)}
						</Typography.Text>
					</div>
					<div className="notification-master__settings--item--select">
						<Select
							mode="multiple"
							size="large"
							placeholder={__(
								'Select taxonomies',
								'notification-master'
							)}
							options={taxonomyOptions}
							value={settings.taxonomies}
							onChange={(value) => {
								updateSetting('taxonomies', value);
							}}
							style={{ width: '100%' }}
						/>
					</div>
				</div>
			)}
			<div
				className={classnames('notification-master__settings--item', {
					'notification-master__settings--item--has-subitem':
						settings.comment_change_trigger,
				})}
			>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Comment change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the comment status changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.comment_change_trigger}
						onChange={(checked) => {
							updateSetting('comment_change_trigger', checked);
						}}
					/>
				</div>
			</div>
			{settings.comment_change_trigger && (
				<div className="notification-master__settings--item notification-master__settings--item--block">
					<div className="notification-master__settings--item--title">
						<Typography.Title level={5}>
							{__('Comment types', 'notification-master')}
						</Typography.Title>
						<Typography.Text>
							{__(
								'Select the comment types for which you want to send notifications when the comment status changes.',
								'notification-master'
							)}
						</Typography.Text>
					</div>
					<div className="notification-master__settings--item--select">
						<Select
							mode="multiple"
							size="large"
							placeholder={__(
								'Select comment types',
								'notification-master'
							)}
							options={commentTypeOptions}
							value={settings.comment_types}
							onChange={(value) => {
								updateSetting('comment_types', value);
							}}
							style={{ width: '100%' }}
						/>
					</div>
				</div>
			)}
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Media change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the media changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.media_change_trigger}
						onChange={(checked) => {
							updateSetting('media_change_trigger', checked);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('User change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the user changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.user_change_trigger}
						onChange={(checked) => {
							updateSetting('user_change_trigger', checked);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Theme change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the theme changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.theme_change_trigger}
						onChange={(checked) => {
							updateSetting('theme_change_trigger', checked);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Plugin change', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, will be able to add notifications when the plugin changes.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.plugin_change_trigger}
						onChange={(checked) => {
							updateSetting('plugin_change_trigger', checked);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__('Privacy', 'notification-master')}
					</Typography.Title>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.privacy_trigger}
						onChange={(checked) => {
							updateSetting('privacy_trigger', checked);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default Triggers;
