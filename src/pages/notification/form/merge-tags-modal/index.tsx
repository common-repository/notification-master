/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { keys, map } from 'lodash';
import { Tabs, Modal, List, Button, Tooltip, Input } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { BeatLoader } from 'react-spinners';

/**
 * Internal dependencies
 */
import './style.scss';
import { useNotification } from '../../context';
import { MergeTagsGroups } from '../../../types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const MergeTagsModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const [search, setSearch] = useState('');
	const { record } = useNotification();
	const { trigger } = record;
	const [groups, setGroups] = useState<MergeTagsGroups>({});
	const [isLoaded, setIsLoaded] = useState(false);
	const { addNotice } = useDispatch('notification-master/core');

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		addNotice({
			type: 'info',
			message: __('Copied to clipboard', 'notification-master'),
			duration: 2,
		});
	};

	useEffect(() => {
		if (!trigger) {
			return;
		}
		apiFetch({
			path: addQueryArgs('/ntfm/v1/notifications/merge-tags', {
				trigger,
			}),
		})
			.then((data) => {
				setGroups(data as MergeTagsGroups);
				setIsLoaded(true);
			})
			.catch(() => {
				addNotice({
					type: 'error',
					message: __(
						'Failed to load merge tags',
						'notification-master'
					),
					duration: 5,
				});
				onClose();
			});
	}, [trigger]);

	if (!trigger) {
		return null;
	}

	return (
		<Modal
			title={__('Merge Tags', 'notification-master')}
			open={isOpen}
			onCancel={onClose}
			footer={[
				<Button key="close" onClick={onClose}>
					{__('Close', 'notification-master')}
				</Button>,
			]}
			width={800}
			zIndex={9999}
			className="notification-master__merge-tags-modal"
		>
			{!isLoaded && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						width: '100%',
					}}
				>
					<BeatLoader />
				</div>
			)}
			{isLoaded && (
				<>
					<Input
						placeholder={__(
							'Search merge tags',
							'notification-master'
						)}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{
							marginBottom: '10px',
							padding: '5px',
						}}
					/>
					<Tabs
						defaultActiveKey="1"
						tabPosition="left"
						style={{
							minHeight: '400px',
						}}
						onTabClick={() => {
							if (search) {
								setSearch('');
							}
						}}
						items={map(keys(groups), (key) => ({
							key,
							label: groups[key].label,
							children: (
								<List
									itemLayout="horizontal"
									dataSource={map(
										keys(groups[key].merge_tags),
										(tag) => {
											const {
												description,
												trigger: supportedTrigger,
											} = groups[key].merge_tags[tag];
											if (
												search &&
												!tag.includes(search) &&
												!description.includes(search)
											) {
												return null;
											}

											if (
												supportedTrigger &&
												supportedTrigger !== trigger
											) {
												return null;
											}

											return {
												tag,
												description,
											};
										}
									).filter((item) => item !== null)}
									style={{
										maxHeight: '600px',
										overflow: 'auto',
									}}
									className="notification-master__merge-tags-list"
									renderItem={(item) => (
										<List.Item
											actions={[
												<Tooltip
													title={__(
														'Copy',
														'notification-master'
													)}
												>
													<CopyOutlined
														onClick={() => {
															copyToClipboard(
																// @ts-ignore - item is not null
																`{{${key}.${item.tag}}}`
															);

															onClose();
														}}
													/>
												</Tooltip>,
											]}
										>
											<List.Item.Meta
												// @ts-ignore - item is not null
												title={`{{${key}.${item.tag}}}`}
												// @ts-ignore - item is not null
												description={item.description}
											/>
										</List.Item>
									)}
								/>
							),
						}))}
					/>
				</>
			)}
		</Modal>
	);
};

export default MergeTagsModal;
