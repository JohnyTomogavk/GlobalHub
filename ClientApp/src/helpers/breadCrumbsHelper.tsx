import React from 'react';
import { ResourceToBreadCrumbsTitleMapping } from '../constants/resourceConstants';
import { SideMenuItemModel } from '../models/shared/sideMenu/sideMenuItemModel';
import { BreadCrumbItem } from '../models/breadCrumbs/breadCrumbItem';
import { Link } from 'react-router-dom';

// TODO: Extract to custom hook
export const getBreadCrumbsItemsByLocation = (
  path: string,
  getSideMenuItemByRoutingPath: (routingPath: string) => SideMenuItemModel | undefined
): BreadCrumbItem[] => {
  const pathSegments = path.split('/').filter((segment) => segment);
  const items: BreadCrumbItem[] = [];

  while (pathSegments.length !== 0) {
    const routingPath = pathSegments.join('/');
    let pageTitle = getSideMenuItemByRoutingPath(routingPath)?.textTitle;

    if (!pageTitle) {
      pageTitle = ResourceToBreadCrumbsTitleMapping[routingPath as keyof typeof ResourceToBreadCrumbsTitleMapping];
    }

    items.unshift({
      title: <Link to={`/${routingPath}`}>{pageTitle}</Link>,
    });

    pathSegments.pop();
  }

  return items;
};
