/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { Button, Typography, Input, Switch, Flex, ColorPicker, Tabs, Card, Collapse, InputNumber, Divider, Select } from 'antd';
import classnames from 'classnames';
import { css } from '@emotion/css';

/**
 * Internal dependencies
 */
import './style.scss';
import config from '@Config';

const WebPush: React.FC = () => {
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
	const { updateSetting, addNotice } = useDispatch(
		'notification-master/core'
	);
	const [isGenerating, setIsGenerating] = useState(false);
	const [normalButtonSubscribe, setNormalButtonSubscribe] = useState(false);
	const [floadingButtonSubscribe, setFloadingButtonSubscribe] = useState(false);
	const [autoSaveKeys, setAutoSaveKeys] = useState(true);

	const { ajaxUrl, nonce, subscribeButtonShortCode, floatingButtonShortCode } = config;
	const generateKeys = async () => {
		if (isGenerating) return;
		setIsGenerating(true);
		try {
			const response = await fetch(ajaxUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'ntfm_generate_keys',
					nonce,
					autoSave: autoSaveKeys ? 'yes' : 'no',
				}),
			});
			const data = await response.json();

			if (data.success) {
				addNotice({
					type: 'success',
					message: __(
						'Keys generated successfully',
						'notification-master'
					),
				});
				updateSetting('webpush_public_key', data.data.public_key);
				updateSetting('webpush_private_key', data.data.private_key);
			} else {
				addNotice({
					type: 'error',
					message: data.data.message,
				});
			}
		} catch (error: any) {
			addNotice({
				type: 'error',
				message:
					error?.message ||
					__('An error occurred', 'notification-master'),
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const getSpacingValues = (value: string) => {
		const values = {
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
		};

		const parts = value.split(' ');

		if (parts.length === 1) {
			values.top = values.right = values.bottom = values.left = parts[0];
		} else if (parts.length === 4) {
			values.top = parts[0];
			values.right = parts[1];
			values.bottom = parts[2];
			values.left = parts[3];
		}

		return values;
	};

	const { top: nBtnPaddingTop, right: nBtnPaddingRight, bottom: nBtnPaddingBottom, left: nBtnPaddingLeft } = getSpacingValues(
		settings.normal_button_padding
	);

	const { top: nBtnMarginTop, right: nBtnMarginRight, bottom: nBtnMarginBottom, left: nBtnMarginLeft } = getSpacingValues(
		settings.normal_button_margin
	);

	const normalButtonClickHandler = () => {
		setNormalButtonSubscribe(!normalButtonSubscribe);
	};

	const floatingButtonClickHandler = () => {
		setFloadingButtonSubscribe(!floadingButtonSubscribe);
	}

	return (
		<div className="notification-master__settings--webpush">
			<div
				className={classnames('notification-master__settings--item')}
				style={{
					borderBottom: 'none',
					paddingBottom: 0,
				}}
			>
				<div
					className="notification-master__settings--item--title"
					style={{ flex: 1 }}
				>
					<Typography.Title level={5}>
						{__('Web Push Public Key', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'This key is used to identify your web push service. use your own key or generate a new one.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div
					className="notification-master__settings--item--switch"
					style={{ flex: 1 }}
				>
					<Input
						value={settings.webpush_public_key}
						onChange={(e) => {
							updateSetting('webpush_public_key', e.target.value);
						}}
					/>
				</div>
			</div>
			<div
				className={classnames('notification-master__settings--item')}
				style={{
					borderBottom: 'none',
					paddingBottom: 0,
				}}
			>
				<div
					className="notification-master__settings--item--title"
					style={{ flex: 1 }}
				>
					<Typography.Title level={5}>
						{__('Web Push Private Key', 'notification-master')}
					</Typography.Title>
					<Typography.Text>
						{__(
							'This key is used to authenticate your web push service. use your own key or generate a new one.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div
					className="notification-master__settings--item--switch"
					style={{ flex: 1 }}
				>
					<Input
						value={settings.webpush_private_key}
						onChange={(e) => {
							updateSetting(
								'webpush_private_key',
								e.target.value
							);
						}}
					/>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<Button
					type="primary"
					onClick={generateKeys}
					loading={isGenerating}
				>
					{__('Generate Keys', 'notification-master')}
				</Button>
				<Flex gap={5}>
					<Switch
						checked={autoSaveKeys}
						onChange={(checked) => {
							setAutoSaveKeys(checked);
						}}
					/>
					<Typography.Text>
						{__(
							'Automatically save the keys after generating.',
							'notification-master'
						)}
					</Typography.Text>

				</Flex>
			</div>
			<div
				className={classnames('notification-master__settings--item')}
				style={{
					padding: 20,
				}}
			>
				<div style={{ flex: 1 }}>
					<div style={{ marginBottom: 10 }}>
						<Typography.Title
							level={5}
							style={{
								marginTop: 0,
							}}
						>
							{__('Subscribe Buttons', 'notification-master')}
						</Typography.Title>
					</div>
					<Flex gap={20}>
						<Card
							title={__('Normal Button', 'notification-master')}
							style={{ flex: 1 }}
						>
							<Flex vertical gap={20} wrap='wrap'>
								<div>
									<Typography.Text>
										{__(
											'Use this shortcode to display the subscribe button:',
											'notification-master'
										)}{' '}
									</Typography.Text>
									<Typography.Text code>
										{subscribeButtonShortCode}
									</Typography.Text>
								</div>
								<Card>
									<Flex justify='center' align='center'>
										<button className={classnames("ntfm-subscribe-btn", {
											'subscribed': normalButtonSubscribe,
										}, css`
									color: ${settings.normal_button_color};
									background-color: ${settings.normal_button_background_color};
									border-radius: ${settings.normal_button_border_radius}px;
									padding: ${nBtnPaddingTop}px ${nBtnPaddingRight}px ${nBtnPaddingBottom}px ${nBtnPaddingLeft}px;
									:hover {
										color: ${settings.normal_button_hover_color};
										background-color: ${settings.normal_button_hover_background_color};
									}
								`)}
											type="button"
											onClick={normalButtonClickHandler}>

											{normalButtonSubscribe ? settings.normal_button_unsubscribe_text : settings.normal_button_text}
										</button>
									</Flex>
								</Card>
								<Collapse
									defaultActiveKey={'text'}
									items={[
										{
											key: 'text',
											label: __('Text', 'notification-master'),
											children: (
												<Flex vertical gap={30}>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Text', 'notification-master')}
														</Typography.Text>
														<Input
															value={settings.normal_button_text}
															onChange={(e) => {
																updateSetting('normal_button_text', e.target.value);
															}}
														/>
													</Flex>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Unsubscribe Text', 'notification-master')}
														</Typography.Text>
														<Input
															value={settings.normal_button_unsubscribe_text}
															onChange={(e) => {
																updateSetting('normal_button_unsubscribe_text', e.target.value);
															}}
														/>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'colors',
											label: __('Colors', 'notification-master'),
											children: (
												<Tabs
													items={[
														{
															key: 'normal',
															label: __('Normal', 'notification-master'),
															children: (
																<Flex gap={30} vertical>
																	<Flex vertical align='start' gap={10}>
																		<Typography.Text strong>
																			{__('Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.normal_button_color}
																			onChange={(color) => {
																				updateSetting('normal_button_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																	<Flex vertical gap={10} align='start'>
																		<Typography.Text strong>
																			{__('Background Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.normal_button_background_color}
																			onChange={(color) => {
																				updateSetting('normal_button_background_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																</Flex>
															),
														},
														{
															key: 'hover',
															label: __('Hover', 'notification-master'),
															children: (
																<Flex gap={30} vertical>
																	<Flex vertical gap={10} align='start'>
																		<Typography.Text strong>
																			{__('Hover Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.normal_button_hover_color}
																			onChange={(color) => {
																				updateSetting('normal_button_hover_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																	<Flex vertical gap={10} align='start'>
																		<Typography.Text strong>
																			{__('Hover Background Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.normal_button_hover_background_color}
																			onChange={(color) => {
																				updateSetting('normal_button_hover_background_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																</Flex>
															),
														},
													]}
												/>
											)
										},
										{
											key: 'spacing',
											label: __('Spacing', 'notification-master'),
											children: (
												<Flex gap={10} vertical>
													<Flex gap={20} vertical>
														<Typography.Text strong>
															{__('Padding', 'notification-master')}
														</Typography.Text>
														<Flex gap={30}>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Top', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnPaddingTop}
																		onChange={(value) => {
																			updateSetting('normal_button_padding', `${value} ${nBtnPaddingRight} ${nBtnPaddingBottom} ${nBtnPaddingLeft}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Right', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnPaddingRight}
																		onChange={(value) => {
																			updateSetting('normal_button_padding', `${nBtnPaddingTop} ${value} ${nBtnPaddingBottom} ${nBtnPaddingLeft}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Bottom', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnPaddingBottom}
																		onChange={(value) => {
																			updateSetting('normal_button_padding', `${nBtnPaddingTop} ${nBtnPaddingRight} ${value} ${nBtnPaddingLeft}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Left', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnPaddingLeft}
																		onChange={(value) => {
																			updateSetting('normal_button_padding', `${nBtnPaddingTop} ${nBtnPaddingRight} ${nBtnPaddingBottom} ${value}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
														</Flex>
													</Flex>
													<Divider />
													<Flex vertical gap={20}>
														<Typography.Text strong>
															{__('Margin', 'notification-master')}
														</Typography.Text>
														<Flex gap={30}>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Top', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnMarginTop}
																		onChange={(value) => {
																			updateSetting('normal_button_margin', `${value} ${nBtnMarginRight} ${nBtnMarginBottom} ${nBtnMarginLeft}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Right', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnMarginRight}
																		onChange={(value) => {
																			updateSetting('normal_button_margin', `${nBtnMarginTop} ${value} ${nBtnMarginBottom} ${nBtnMarginLeft}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Bottom', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnMarginBottom}
																		onChange={(value) => {
																			updateSetting('normal_button_margin', `${nBtnMarginTop} ${nBtnMarginRight} ${value} ${nBtnMarginLeft}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text>
																	{__('Left', 'notification-master')}
																</Typography.Text>
																<Flex gap={5}>
																	<InputNumber
																		value={nBtnMarginLeft}
																		onChange={(value) => {
																			updateSetting('normal_button_margin', `${nBtnMarginTop} ${nBtnMarginRight} ${nBtnMarginBottom} ${value}`);
																		}}
																	/>
																	<Typography.Text>px</Typography.Text>
																</Flex>
															</Flex>
														</Flex>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'border-radius',
											label: __('Border', 'notification-master'),
											children: (
												<Flex gap={20} vertical>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Border Radius', 'notification-master')}
														</Typography.Text>
														<Flex gap={5}>
															<InputNumber
																value={settings.normal_button_border_radius}
																onChange={(value) => {
																	updateSetting('normal_button_border_radius', value);
																}}
															/>
															<Typography.Text>px</Typography.Text>
														</Flex>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'advanced',
											label: __('Advanced', 'notification-master'),
											children: (
												<Flex gap={20} vertical>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Extra Class', 'notification-master')}
														</Typography.Text>
														<Input
															value={settings.normal_button_extra_class}
															onChange={(e) => {
																updateSetting('normal_button_extra_class', e.target.value);
															}}
														/>
														<Typography.Text color='secondary'>
															{__(
																'Add extra class to the button for custom styling.',
																'notification-master'
															)}
														</Typography.Text>
													</Flex>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('ID', 'notification-master')}
														</Typography.Text>
														<Input
															value={settings.normal_button_id}
															onChange={(e) => {
																updateSetting('normal_button_id', e.target.value);
															}}
														/>
														<Typography.Text color='secondary'>
															{__(
																'Add ID to the button for custom styling.',
																'notification-master'
															)}
														</Typography.Text>
													</Flex>
												</Flex>
											)
										}
									]}
								/>
							</Flex>
						</Card>
						<Card title={__('Floating Button', 'notification-master')} style={{ flex: 1 }}>
							<Flex vertical gap={20} wrap='wrap'>
								<Flex gap={10} vertical align='start'>
									<Typography.Text strong>
										{__(
											'Enable floating button to show a subscribe button on the all pages.',
											'notification-master'
										)}
									</Typography.Text>
									<Switch
										checked={settings.enable_floating_button}
										onChange={(checked) => {
											updateSetting('enable_floating_button', checked);
										}}
									/>
								</Flex>
								<Typography.Text>
									{__(
										'OR',
										'notification-master'
									)}
								</Typography.Text>
								<div>
									<Typography.Text>
										{__(
											'Use this shortcode to display the floating button on a specific page:',
											'notification-master'
										)}{' '}
									</Typography.Text>
									<Typography.Text code>
										{floatingButtonShortCode}
									</Typography.Text>
								</div>
								<Typography.Text>
								</Typography.Text>
								<Card styles={{
									body: {
										minHeight: 150,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}
								}}>
									<button className={classnames("ntfm-subscribe-floating-btn", {
										'subscribed': floadingButtonSubscribe,
										'animated': settings.enable_floating_button_animation,
									}, css`
									background-color: ${settings.floating_button_background_color};
									border-radius: ${settings.floating_button_border_radius}%;
									width: ${settings.floating_button_width}px;
									height: ${settings.floating_button_height}px;
									svg {
										fill: ${settings.floating_button_color};
									}
									:hover {
										background-color: ${settings.floating_button_hover_background_color};
										svg {
											fill: ${settings.floating_button_hover_color};
										}
									}
								`)}
										type="button"
										onClick={floatingButtonClickHandler}>
										<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 312.061 373.784">
											<g id="Group_698" data-name="Group 698" transform="translate(0.528)">
												<path id="Subtraction_6" data-name="Subtraction 6" d="M295.268,267.945H15.737c-8.218,0-13.042-6.144-14.819-11.895-2.115-6.864-.854-16.106,6.732-21.28l22.87-15.594C47,207.945,57.235,187.4,57.235,165.57V96.741c0-25.84,8.858-50.134,24.939-68.406S119.635,0,142.376,0h26.254c22.743,0,44.12,10.062,60.2,28.334S253.763,70.9,253.763,96.741V165.57c0,21.834,10.238,42.375,26.713,53.608l22.881,15.594c7.586,5.173,8.844,14.415,6.73,21.28C308.311,261.8,303.488,267.945,295.268,267.945ZM97.286,184.863c1.7,7.8,3.927,12.72,7.025,15.494,7.7,6.89,19.276,6.89,42.337,6.89h17.709c23.063,0,34.636,0,42.337-6.89,3.1-2.776,5.33-7.7,7.027-15.494Zm-6.77-63.1v.009c-.408,3.09.117,7.968.909,15.352l1.495,13.9q.389,3.622.748,7.124l.02.206c.525,5.055,1.021,9.83,1.6,14.3H215.721c.588-4.6,1.1-9.476,1.63-14.644q.358-3.431.735-6.987l1.492-13.88.018-.17c.787-7.314,1.308-12.146.893-15.21l.144.007a12.219,12.219,0,1,0-9.243-4.237c-2.667,1.645-6.11,5.079-11.324,10.278-4.04,4.024-6.056,6.032-8.306,6.348a6.819,6.819,0,0,1-3.664-.508c-2.083-.924-3.465-3.407-6.216-8.353L167.31,99.178l-.063-.114c-1.578-2.828-3.068-5.5-4.353-7.558a16.281,16.281,0,1,0-14.783,0c-1.29,2.066-2.778,4.734-4.353,7.558l-.063.114L129.124,125.3c-2.75,4.947-4.132,7.43-6.216,8.353a6.819,6.819,0,0,1-3.664.508c-2.241-.315-4.254-2.32-8.272-6.315-5.244-5.229-8.691-8.666-11.358-10.311a12.206,12.206,0,1,0-9.241,4.237l.133-.007Z" transform="translate(0 68.281)" stroke="rgba(0,0,0,0)" stroke-miterlimit="10" stroke-width="1" />
												<circle id="Ellipse_2" data-name="Ellipse 2" cx="23.353" cy="23.353" r="23.353" transform="translate(132.149 0)" />
												<circle id="Ellipse_3" data-name="Ellipse 3" cx="37.557" cy="37.557" r="37.557" transform="translate(117.944 298.67)" />
											</g>
										</svg>
										{settings.enable_floating_button_tooltip && (
											<span className="ntfm-subscribe-floating-btn-tooltip">{floadingButtonSubscribe ? settings.floating_button_tooltip_unsubscribe_text : settings.floating_button_tooltip_subscribe_text}</span>
										)}
									</button>
								</Card>
								<Collapse
									defaultActiveKey={'tooltip'}
									items={[
										{
											key: 'tooltip',
											label: __('Tooltip', 'notification-master'),
											children: (
												<Flex vertical gap={30}>
													<Typography.Text color='secondary'>
														{__(
															'Enable tooltip to show a message when user hover on the button. (Hover Effect will be shown in frontend)',
															'notification-master'
														)}
													</Typography.Text>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Enable Tooltip', 'notification-master')}
														</Typography.Text>
														<Switch
															checked={settings.enable_floating_button_tooltip}
															onChange={(checked) => {
																updateSetting('enable_floating_button_tooltip', checked);
															}}
														/>
													</Flex>
													{settings.enable_floating_button_tooltip && (
														<>
															<Flex vertical gap={10} align='start'>
																<Typography.Text strong>
																	{__('Subscribe Text', 'notification-master')}
																</Typography.Text>
																<Input
																	value={settings.floating_button_tooltip_subscribe_text}
																	onChange={(e) => {
																		updateSetting('floating_button_tooltip_subscribe_text', e.target.value);
																	}}
																/>
															</Flex>
															<Flex vertical gap={10} align='start'>
																<Typography.Text strong>
																	{__('Unsubscribe Text', 'notification-master')}
																</Typography.Text>
																<Input
																	value={settings.floating_button_tooltip_unsubscribe_text}
																	onChange={(e) => {
																		updateSetting('floating_button_tooltip_unsubscribe_text', e.target.value);
																	}}
																/>
															</Flex>
														</>
													)}
												</Flex>
											)
										},
										{
											key: 'animation',
											label: __('Animation', 'notification-master'),
											children: (
												<Flex vertical gap={30}>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Enable Animation', 'notification-master')}
														</Typography.Text>
														<Switch
															checked={settings.enable_floating_button_animation}
															onChange={(checked) => {
																updateSetting('enable_floating_button_animation', checked);
															}}
														/>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'position',
											label: __('Position', 'notification-master'),
											children: (
												<Flex gap={20} vertical>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Position', 'notification-master')}
														</Typography.Text>
														<Select
															value={settings.floating_button_position}
															onChange={(value) => {
																updateSetting('floating_button_position', value);
															}}
															options={[
																{
																	label: __('Top Left', 'notification-master'),
																	value: 'top-left',
																},
																{
																	label: __('Top Right', 'notification-master'),
																	value: 'top-right',
																},
																{
																	label: __('Bottom Left', 'notification-master'),
																	value: 'bottom-left',
																},
																{
																	label: __('Bottom Right', 'notification-master'),
																	value: 'bottom-right',
																},
															]}
														/>
													</Flex>
													{settings.floating_button_position.includes('top') && (
														<Flex vertical gap={10} align='start'>
															<Typography.Text strong>
																{__('Top Offset', 'notification-master')}
															</Typography.Text>
															<Flex gap={5}>
																<InputNumber
																	value={settings.floating_button_top}
																	onChange={(value) => {
																		updateSetting('floating_button_top', value);
																	}}
																/>
																<Typography.Text>px</Typography.Text>
															</Flex>
														</Flex>
													)}
													{settings.floating_button_position.includes('bottom') && (
														<Flex vertical gap={10} align='start'>
															<Typography.Text strong>
																{__('Bottom Offset', 'notification-master')}
															</Typography.Text>
															<Flex gap={5}>
																<InputNumber
																	value={settings.floating_button_bottom}
																	onChange={(value) => {
																		updateSetting('floating_button_bottom', value);
																	}}
																/>
																<Typography.Text>px</Typography.Text>
															</Flex>
														</Flex>
													)}
													{settings.floating_button_position.includes('left') && (
														<Flex vertical gap={10} align='start'>
															<Typography.Text strong>
																{__('Left Offset', 'notification-master')}
															</Typography.Text>
															<Flex gap={5}>
																<InputNumber
																	value={settings.floating_button_left}
																	onChange={(value) => {
																		updateSetting('floating_button_left', value);
																	}}
																/>
																<Typography.Text>px</Typography.Text>
															</Flex>
														</Flex>
													)}
													{settings.floating_button_position.includes('right') && (
														<Flex vertical gap={10} align='start'>
															<Typography.Text strong>
																{__('Right Offset', 'notification-master')}
															</Typography.Text>
															<Flex gap={5}>
																<InputNumber
																	value={settings.floating_button_right}
																	onChange={(value) => {
																		updateSetting('floating_button_right', value);
																	}}
																/>
																<Typography.Text>px</Typography.Text>
															</Flex>
														</Flex>
													)}
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Z-Index', 'notification-master')}
														</Typography.Text>
														<InputNumber
															value={settings.floating_button_z_index}
															onChange={(value) => {
																updateSetting('floating_button_z_index', value);
															}}
														/>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'colors',
											label: __('Colors', 'notification-master'),
											children: (
												<Tabs
													items={[
														{
															key: 'normal',
															label: __('Normal', 'notification-master'),
															children: (
																<Flex gap={30} vertical>
																	<Flex vertical align='start' gap={10}>
																		<Typography.Text strong>
																			{__('Icon Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.floating_button_color}
																			onChange={(color) => {
																				updateSetting('floating_button_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																	<Flex vertical gap={10} align='start'>
																		<Typography.Text strong>
																			{__('Background Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.floating_button_background_color}
																			onChange={(color) => {
																				updateSetting('floating_button_background_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																</Flex>
															),
														},
														{
															key: 'hover',
															label: __('Hover', 'notification-master'),
															children: (
																<Flex gap={30} vertical>
																	<Flex vertical gap={10} align='start'>
																		<Typography.Text strong>
																			{__('Hover Icon Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.floating_button_hover_color}
																			onChange={(color) => {
																				updateSetting('floating_button_hover_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																	<Flex vertical gap={10} align='start'>
																		<Typography.Text strong>
																			{__('Hover Background Color', 'notification-master')}
																		</Typography.Text>
																		<ColorPicker
																			defaultValue={settings.floating_button_hover_background_color}
																			onChange={(color) => {
																				updateSetting('floating_button_hover_background_color', color.toHexString());
																			}}
																			showText
																		/>
																	</Flex>
																</Flex>
															),
														},
													]}
												/>
											)
										},
										{
											key: 'size',
											label: __('Size', 'notification-master'),
											children: (
												<Flex gap={10} vertical>
													<Flex gap={20} vertical>
														<Typography.Text strong>
															{__('Width', 'notification-master')}
														</Typography.Text>
														<Flex gap={5}>
															<InputNumber
																value={settings.floating_button_width}
																onChange={(value) => {
																	updateSetting('floating_button_width', value);
																}}
															/>
															<Typography.Text>px</Typography.Text>
														</Flex>
													</Flex>
													<Flex gap={20} vertical>
														<Typography.Text strong>
															{__('Height', 'notification-master')}
														</Typography.Text>
														<Flex gap={5}>
															<InputNumber
																value={settings.floating_button_height}
																onChange={(value) => {
																	updateSetting('floating_button_height', value);
																}}
															/>
															<Typography.Text>px</Typography.Text>
														</Flex>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'border-radius',
											label: __('Border', 'notification-master'),
											children: (
												<Flex gap={20} vertical>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Border Radius', 'notification-master')}
														</Typography.Text>
														<Flex gap={5}>
															<InputNumber
																value={settings.floating_button_border_radius}
																onChange={(value) => {
																	updateSetting('floating_button_border_radius', value);
																}}
															/>
															<Typography.Text>%</Typography.Text>
														</Flex>
													</Flex>
												</Flex>
											)
										},
										{
											key: 'advanced',
											label: __('Advanced', 'notification-master'),
											children: (
												<Flex gap={20} vertical>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('Extra Class', 'notification-master')}
														</Typography.Text>
														<Input
															value={settings.floating_button_extra_class}
															onChange={(e) => {
																updateSetting('floating_button_extra_class', e.target.value);
															}}
														/>
														<Typography.Text color='secondary'>
															{__(
																'Add extra class to the button for custom styling.',
																'notification-master'
															)}
														</Typography.Text>
													</Flex>
													<Flex vertical gap={10} align='start'>
														<Typography.Text strong>
															{__('ID', 'notification-master')}
														</Typography.Text>
														<Input
															value={settings.floating_button_id}
															onChange={(e) => {
																updateSetting('floating_button_id', e.target.value);
															}}
														/>
														<Typography.Text color='secondary'>
															{__(
																'Add ID to the button for custom styling.',
																'notification-master'
															)}
														</Typography.Text>
													</Flex>
												</Flex>
											)
										}
									]}
								/>
							</Flex>
						</Card>
					</Flex>
				</div>
			</div>
			<div className={classnames('notification-master__settings--item')}>
				<div className="notification-master__settings--item--title">
					<Typography.Title level={5}>
						{__(
							'Auto Display Web Push Prompt',
							'notification-master'
						)}
					</Typography.Title>
					<Typography.Text>
						{__(
							'If enabled, the web push prompt will be displayed automatically after user click on the page.',
							'notification-master'
						)}
					</Typography.Text>
				</div>
				<div className="notification-master__settings--item--switch">
					<Switch
						title={__('Enable', 'notification-master')}
						checkedChildren={__('On', 'notification-master')}
						unCheckedChildren={__('Off', 'notification-master')}
						checked={settings.webpush_auto_prompt}
						onChange={(checked) => {
							updateSetting('webpush_auto_prompt', checked);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default WebPush;
