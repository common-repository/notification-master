/**
 * WordPress dependencies
 */
import { useCallback } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useNavigate, useMatch } from 'react-router-dom';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { getPath } from '@Utils';
import { pages } from '@Pages';
import config from '@Config';

const Nav: React.FC = () => {
	const navigate = useNavigate();

	const changeCurrentPage = useCallback((slug: string) => {
		const link = document.querySelector(
			`.wp-submenu-wrap a[href*="ntfm-${slug}"]`
		);

		if (!link) {
			return;
		}
		const submenuItem = link.parentElement;
		submenuItem?.classList.add('current');
		const siblings = Array.from(submenuItem?.parentElement?.children || []);

		siblings.forEach((sibling) => {
			if (sibling !== submenuItem) {
				// @ts-ignore sibling is not null
				sibling.classList.remove('current');
			}
		});
	}, []);

	return (
		<nav className="notification-master__nav">
			<div className="notification-master__nav-inner">
				<div className="notification-master__nav-logo">
					<img
						className="notification-master__nav-logo-image
					"
						src={config.assetsUrl + 'logo.png'}
						alt="Notification Master"
					/>
				</div>
				<ul className="notification-master__nav-list">
					{pages.map((page, index) => {
						if (page.hidden) {
							return null;
						}
						const path = getPath(page.slug);
						const match =
							page.path === '/notifications' ||
							page.path === '/integrations'
								? useMatch(`${page.path}/*`)
								: useMatch(page.path);

						return (
							<a
								key={index}
								className={classnames(
									'notification-master__nav-item',
									{
										'notification-master__nav-item--active':
											match,
									}
								)}
								href={path}
								onClick={(e: React.MouseEvent) => {
									e.preventDefault();
									navigate(path);
									changeCurrentPage(page.slug);
								}}
							>
								{page.title}
							</a>
						);
					})}
					{/* Documentation */}
					<a
						className="notification-master__nav-item"
						href={`${config.ntfmSiteUrl}/docs/getting-started`}
						target="_blank"
						rel="noreferrer"
					>
						{__('Documentation', 'notification-master')}
						<span className="ntfm-icon">
							<svg
								stroke="currentColor"
								fill="currentColor"
								stroke-width="0"
								viewBox="0 0 24 24"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M18.25 15.5a.75.75 0 0 1-.75-.75V7.56L7.28 17.78a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L16.44 6.5H9.25a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75Z"></path>
							</svg>
						</span>
					</a>
				</ul>
			</div>
		</nav>
	);
};

export default Nav;
