import React from 'react'
import { NavLink } from 'react-router-dom'

import * as styles from './SideNavigation.css'
import { SideNavigationProps } from './SideNavigation.types'

export const SideNavigation: React.FC<SideNavigationProps> = ({
  items,
  className
}) => {
  return (
    <nav className={`${styles.navContainer} ${className || ''}`}>
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
              }
              title={item.label}
            >
              <span className={styles.iconWrapper}>{item.icon}</span>
              <span className={styles.linkText}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
