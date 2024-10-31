/**
 * External dependencies
 */
import Icon from '@ant-design/icons';
import type { GetProps } from 'antd';

type CustomIconComponentProps = GetProps<typeof Icon>;

export const MergeTagsIcon: React.FC<CustomIconComponentProps> = (
	props: CustomIconComponentProps
) => {
	return (
		<Icon
			component={() => (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="2em"
					height="2em"
					viewBox="0 0 325 305"
				>
					<g
						id="Group_396"
						data-name="Group 396"
						transform="translate(-1357 -1785)"
					>
						<text
							id="_"
							data-name="}"
							transform="translate(1552 2024)"
							font-size="224"
							font-family="NotoSans-Medium, Noto Sans"
							font-weight="500"
							letter-spacing="0.01em"
						>
							<tspan x="0" y="0">
								{'}'}
							</tspan>
						</text>
						<text
							id="_2"
							data-name="}"
							transform="translate(1595 2024)"
							font-size="224"
							font-family="NotoSans-Medium, Noto Sans"
							font-weight="500"
							letter-spacing="0.01em"
						>
							<tspan x="0" y="0">
								{'}'}
							</tspan>
						</text>
						<text
							id="_3"
							data-name="}"
							transform="matrix(-1, 0, 0, 1, 1487, 2024)"
							font-size="224"
							font-family="NotoSans-Medium, Noto Sans"
							font-weight="500"
							letter-spacing="0.01em"
						>
							<tspan x="0" y="0">
								{'}'}
							</tspan>
						</text>
						<text
							id="_4"
							data-name="}"
							transform="matrix(-1, 0, 0, 1, 1444, 2024)"
							font-size="224"
							font-family="NotoSans-Medium, Noto Sans"
							font-weight="500"
							letter-spacing="0.01em"
						>
							<tspan x="0" y="0">
								{'}'}
							</tspan>
						</text>
						<circle
							id="Ellipse_73"
							data-name="Ellipse 73"
							cx="7.278"
							cy="7.278"
							r="7.278"
							transform="translate(1512.269 1985)"
						/>
						<circle
							id="Ellipse_75"
							data-name="Ellipse 75"
							cx="7.278"
							cy="7.278"
							r="7.278"
							transform="translate(1532.324 1985)"
						/>
						<circle
							id="Ellipse_74"
							data-name="Ellipse 74"
							cx="7.278"
							cy="7.278"
							r="7.278"
							transform="translate(1492.218 1985)"
						/>
					</g>
				</svg>
			)}
			{...props}
		/>
	);
};
