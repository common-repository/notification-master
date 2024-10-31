/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { MergeTagsIcon as MergeTagsIconComponent } from '@Icons';

const MergeTagsIcon: React.FC = () => {
	const { toggleMergeTags } = useDispatch('notification-master/core');

	return <MergeTagsIconComponent onClick={() => toggleMergeTags(true)} />;
};

export default MergeTagsIcon;
