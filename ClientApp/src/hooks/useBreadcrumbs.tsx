import React, { useEffect, useState } from 'react';
import { BreadCrumbItem } from '../models/breadCrumbs/breadCrumbItem';
import { SideMenuItemModel } from '../models/shared/sideMenu/sideMenuItemModel';
import { ResourceToBreadCrumbsTitleMapping } from '../constants/resourceConstants';
import { Link } from 'react-router-dom';

const getSideMenuItemByRoutingPath = (
  routingPath: string,
  sideMenuItems: SideMenuItemModel[]
): SideMenuItemModel | undefined => sideMenuItems.find((item) => item.key === routingPath);

const useBreadcrumbs = (currentLocationPath: string, sideMenuModels: SideMenuItemModel[]): BreadCrumbItem[] => {
  const [breadCrumbsItems, setBreadCrumbsItems] = useState<BreadCrumbItem[]>([]);

  useEffect(() => {
    if (currentLocationPath.length === 0 || sideMenuModels.length === 0) return;

    const pathSegments = currentLocationPath.split('/').filter((segment) => segment);
    const items: BreadCrumbItem[] = [];

    while (pathSegments.length !== 0) {
      const routingPath = pathSegments.join('/');
      let pageTitle = getSideMenuItemByRoutingPath(routingPath, sideMenuModels)?.textTitle;

      if (!pageTitle) {
        pageTitle = ResourceToBreadCrumbsTitleMapping[routingPath as keyof typeof ResourceToBreadCrumbsTitleMapping];
      }

      items.unshift({
        title: <Link to={`/${routingPath}`}>{pageTitle}</Link>,
      });

      pathSegments.pop();
    }

    setBreadCrumbsItems(items);
  }, [currentLocationPath, sideMenuModels]);

  return breadCrumbsItems;
};

export default useBreadcrumbs;
