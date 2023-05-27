import React from 'react';
import { ResourceToBreadCrumbsTitleMapping } from '../constants/resourceConstants';
import { SideMenuItemModel } from '../models/shared/sideMenu/sideMenuItemModel';
import { BreadCrumbItem } from '../models/breadCrumbs/breadCrumbItem';
import { Link } from 'react-router-dom';

type BreadCrumbsItem = { title: string } | { title: JSX.Element };

export const getBreadCrumbsItemsByLocation = (
  path: string,
  getSideMenuItemByRoutingKey: (key: string) => SideMenuItemModel | undefined
): BreadCrumbsItem[] => {
  const pathSegments = location.pathname.split('/').filter((segment) => segment);

  const items: BreadCrumbItem[] = [];

  while (pathSegments.length !== 0) {
    const pageRoutingKey = pathSegments.join('/');
    let pageTitle = getSideMenuItemByRoutingKey(pageRoutingKey)?.textTitle;

    if (!pageTitle) {
      pageTitle = ResourceToBreadCrumbsTitleMapping[pageRoutingKey as keyof typeof ResourceToBreadCrumbsTitleMapping];
    }

    items.push({
      title: <Link to={`/${pageRoutingKey}`}>{pageTitle}</Link>,
    });

    pathSegments.pop();
  }

  return items.reverse();
};
